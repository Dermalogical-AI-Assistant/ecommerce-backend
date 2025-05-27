import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderByIdCommand } from './updateOrderById.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';
import { OrderStatus, RoleType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { ProductService } from 'src/modules/product/services';

@CommandHandler(UpdateOrderByIdCommand)
export class UpdateOrderByIdHandler
  implements ICommandHandler<UpdateOrderByIdCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService
  ) { }

  public async execute(command: UpdateOrderByIdCommand): Promise<void> {
    if (command.user.role == RoleType.ADMIN) {
      await this.updateOrderByAdmin(command);
    } else {
      await this.updateOrderByUser(command);
    }
  }

  private async updateOrderByAdmin({ id, body: { status } }: UpdateOrderByIdCommand) {
    await this.orderService.validateOrderExistsById(id);
    await this.dbContext.order.update({
      where: {
        id
      },
      data: {
        status
      }
    })
  }

  private async updateOrderByUser({ id, user, body }: UpdateOrderByIdCommand) {
    const {
      shippingAddressId,
      paymentMethod,
      paymentStatus,
      shippingFee,
      status,
    } = body;
    const order = await this.orderService.validateOrderExistsById(id);

    const orderItems = await this.dbContext.orderItem.findMany({
      where: { orderId: id },
      include: {
        product: true,
      }
    });

    if (order.status != OrderStatus.PENDING && order.status != OrderStatus.DRAFT) {
      throw new BadRequestException('This order cannot be updated!');
    }

    if (order.userId != user.id) {
      throw new BadRequestException('You are not allowed to update this order!');
    }

    const updatedData = {
      ...(shippingAddressId && { shippingAddressId }),
      ...(paymentMethod && { paymentMethod }),
      ...(paymentStatus && { paymentStatus }),
      ...(status && { status }),
      ...(shippingFee && {
        shippingFee, totalAmount: order.totalAmount - order.shippingFee + shippingFee,
        finalAmount: order.finalAmount - order.shippingFee + shippingFee
      }),
    };

    const processedOrderStatus = [OrderStatus.PENDING, OrderStatus.SHIPPING, OrderStatus.DELIVERED] as OrderStatus[];
    const isCancelStatus = (processedOrderStatus.includes(order.status)) && (status == OrderStatus.CANCELED);
    const isConfirmStatus = (order.status == OrderStatus.PENDING) && (status == OrderStatus.CONFIRMED);

    await this.dbContext.$transaction(async (tx) => {
      tx.order.update({
        where: { id },
        data: updatedData,
      });

      // If confirming order, subtract quantities
      if (isConfirmStatus) {
        for (const oi of orderItems) {
          const product = await tx.product.update({
            where: { id: oi.productId },
            data: { totalQuantity: oi.product.totalQuantity - oi.quantity },
            select: {
              id: true,
              title: true,
              averageRating: true,
              skincareConcerns: true,
              thumbnail: true,
              additionalImages: true,
              createdAt: true,
              price: true,
              currency: true,
              ingredientBenefits: true,
              fullIngredientsList: true,
              description: true,
              howToUse: true,
              totalQuantity: true,
            }
          });

          await this.productService.updateProductInNeo4j(
            product,
            false,
          );
        }
      }

      // If canceling order, add quantities
      if (isCancelStatus) {
        for (const oi of orderItems) {
          const product = await tx.product.update({
            where: { id: oi.productId },
            data: { totalQuantity: oi.product.totalQuantity + oi.quantity },
            select: {
              id: true,
              title: true,
              averageRating: true,
              skincareConcerns: true,
              thumbnail: true,
              additionalImages: true,
              createdAt: true,
              price: true,
              currency: true,
              ingredientBenefits: true,
              fullIngredientsList: true,
              description: true,
              howToUse: true,
              totalQuantity: true,
            }
          });
          await this.productService.updateProductInNeo4j(
            product,
            false,
          );
        }
      }
    });
  }
}
