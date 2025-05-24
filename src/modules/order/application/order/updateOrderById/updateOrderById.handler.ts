import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrderByIdCommand } from './updateOrderById.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';
import { OrderStatus, RoleType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateOrderByIdCommand)
export class UpdateOrderByIdHandler
  implements ICommandHandler<UpdateOrderByIdCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
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

    await this.dbContext.order.update({
      where: {
        id,
      },
      data: updatedData
    });
  }
}
