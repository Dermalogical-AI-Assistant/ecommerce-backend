import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderItemByIdCommand } from './deleteOrderItemById.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';

@CommandHandler(DeleteOrderItemByIdCommand)
export class DeleteOrderItemByIdHandler
  implements ICommandHandler<DeleteOrderItemByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  public async execute({ id }: DeleteOrderItemByIdCommand) {
    await this.orderService.validateOrderItemExistsById(id);

    const orderItem = await this.dbContext.orderItem.findUnique({
      where: {
        id,
      },
      select: {
        cartItem: {
          select: {
            product: true,
            quantity: true,
          },
        },
        order: {
          select: {
            id: true,
            totalAmount: true,
            totalDiscount: true,
          },
        },
      },
    });

    const { discountAmount, discounts } =
      await this.orderService.getValidDiscountsForProduct(
        orderItem.cartItem.product,
        orderItem.cartItem.quantity,
      );

    const totalAmount =
      orderItem.order.totalAmount -
      orderItem.cartItem.product.price * orderItem.cartItem.quantity;
    const totalDiscount = orderItem.order.totalDiscount - discountAmount;
    const order = await this.dbContext.order.update({
      where: {
        id: orderItem.order.id,
      },
      data: {
        totalAmount,
        totalDiscount,
        finalAmount: totalAmount - totalDiscount,
      },
    });

    await this.dbContext.discountOrder.deleteMany({
      where: { orderItemId: id },
    });
    await this.dbContext.orderItem.delete({ where: { id } });
    return order;
  }
}
