import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderByIdCommand } from './updateOrderById.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';

@CommandHandler(UpdateOrderByIdCommand)
export class UpdateOrderByIdHandler
  implements ICommandHandler<UpdateOrderByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  public async execute({ id, body }: UpdateOrderByIdCommand): Promise<void> {
    const {
      shippingAddressId,
      paymentMethod,
      paymentStatus,
      shippingFee,
      status,
    } = body;
    const order = await this.orderService.validateOrderExistsById(id);

    await this.dbContext.order.update({
      where: {
        id,
      },
      data: {
        shippingAddressId,
        paymentMethod,
        paymentStatus,
        shippingFee,
        status,
        totalAmount: order.totalAmount + shippingFee,
      },
    });
  }
}
