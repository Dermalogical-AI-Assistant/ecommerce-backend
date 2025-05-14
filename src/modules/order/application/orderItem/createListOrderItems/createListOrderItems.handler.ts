import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateListOrderItemsCommand } from './createListOrderItems.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';

@CommandHandler(CreateListOrderItemsCommand)
export class CreateListOrderItemsHandler
  implements ICommandHandler<CreateListOrderItemsCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  public async execute({
    userId,
    body: { orderItems },
  }: CreateListOrderItemsCommand) {
    const defaultShippingAddress =
      await this.dbContext.shippingAddress.findFirst({
        where: {
          userId,
          isDefault: true,
        },
        select: {
          id: true,
        },
      });

    const order = await this.dbContext.order.create({
      data: {
        userId,
        shippingAddressId: defaultShippingAddress.id,
      },
      select: {
        id: true,
        shippingAddress: true
      },
    });

    const productIds = [...new Set(orderItems.map((x) => x.productId))];

    const cartItems = await this.dbContext.cartItem.findMany({
      where: {
        userId,
        productId: {
          in: productIds,
        },
      },
      select: {
        product: true,
        quantity: true
      },
    });

    const createdOrderItems = [];
    let totalAmount = 0;
    let totalDiscount = 0;

    for (const { productId, note } of orderItems) {
      const cartItem = cartItems.find((x) => x.product.id == productId);
      const product = cartItem.product;

      const originalPrice = product.price * cartItem.quantity;
      totalAmount += originalPrice;

      const { discounts, discountAmount } =
        await this.orderService.getValidDiscountsForProduct(product, cartItem.quantity);

      totalDiscount += discountAmount;

      const orderItem = await this.dbContext.orderItem.create({
        data: {
          userId,
          orderId: order.id,
          note,
          productId,
          originalPrice,
          discountAmount,
          finalPrice: originalPrice - discountAmount,
          discounts: {
            createMany: {
              data: discounts.map((d) => ({
                discountId: d.id,
              })),
            },
          },
        },
        select: {
          id: true,
          note: true,
          originalPrice: true,
          discountAmount: true,
          finalPrice: true,
          cartItem: {
            select: {
              quantity: true,
              product: true,
            },
          },
        },
      });

      createdOrderItems.push(orderItem);
    }

    await this.dbContext.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalAmount,
        totalDiscount,
        finalAmount: totalAmount - totalDiscount,
      },
    });

    return {
      orderId: order.id,
      shippingAddress: order.shippingAddress,
      totalAmount,
      totalDiscount,
      finalAmount: totalAmount - totalDiscount,
      orderItems: createdOrderItems,
    };
  }
}
