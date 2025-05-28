import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateListOrderItemsCommand } from './createListOrderItems.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateListOrderItemsCommand)
export class CreateListOrderItemsHandler
  implements ICommandHandler<CreateListOrderItemsCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) { }

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

    if (!defaultShippingAddress?.id) {
      throw new NotFoundException('You do not have any shipping address!');
    }

    let order = await this.dbContext.order.create({
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

    const [cartItems, products] = await Promise.all([
      this.dbContext.cartItem.findMany({
        where: {
          userId,
          productId: {
            in: productIds,
          },
        },
        select: {
          id: true,
        },
      }),

      this.dbContext.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      })

    ]);

    const createdOrderItems = [];
    let totalAmount = 0;
    let totalDiscount = 0;

    for (const { productId, quantity, note } of orderItems) {
      const product = products.find(x => x.id == productId);

      const originalPrice = product.price * quantity;
      totalAmount += originalPrice;

      const { discounts, discountAmount } =
        await this.orderService.getValidDiscountsForProduct(product, quantity);

      totalDiscount += discountAmount;

      const orderItem = await this.dbContext.orderItem.create({
        data: {
          userId,
          orderId: order.id,
          productId,
          quantity,
          note,
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
          product: true,
          quantity: true,
          note: true,
          originalPrice: true,
          discountAmount: true,
          finalPrice: true,
          discounts: {
            select: {
              discount: true
            }
          }
        },
      });

      createdOrderItems.push(orderItem);
    }

    order = await this.dbContext.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalAmount,
        totalDiscount,
        finalAmount: totalAmount - totalDiscount,
      },
      select: {
        id: true,
        shippingAddress: true,
        totalAmount: true,
        totalDiscount: true,
        shippingFee: true,
        finalAmount: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true
      }
    });

    await this.dbContext.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems.map(x => x.id)
        }
      }
    });
    
    return {
      order,
      orderItems: createdOrderItems,
    };

  }
}
