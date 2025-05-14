import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetOrderByIdCommand } from './getOrderById.command';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';
import { GetOrderByIdResponse } from './getOrderById.response';
import { BadRequestException } from '@nestjs/common';
import { RoleType } from '@prisma/client';

@CommandHandler(GetOrderByIdCommand)
export class GetOrderByIdHandler
  implements ICommandHandler<GetOrderByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  public async execute({
    id,
    userId,
  }: GetOrderByIdCommand): Promise<GetOrderByIdResponse> {
    await this.orderService.validateOrderExistsById(id);

    const order = await this.dbContext.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            role: true,
          },
        },
        shippingAddress: true,
        shippingFee: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        totalAmount: true,
        totalDiscount: true,
        finalAmount: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            discountAmount: true,
            finalPrice: true,
            originalPrice: true,
            note: true,
            cartItem: {
              select: {
                quantity: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    price: true,
                    currency: true,
                    skincareConcerns: true,
                    averageRating: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (order.user.id !== userId || order.user.role != RoleType.ADMIN) {
      throw new BadRequestException('You are not allowed to view this order!');
    }

    const { user, ...orderWithoutUser } = order;
    return orderWithoutUser;
  }
}
