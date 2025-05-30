import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './getOrderById.query';
import { PrismaService } from 'src/database';
import { OrderService } from 'src/modules/order/services';
import { GetOrderByIdResponse } from './getOrderById.response';
import { BadRequestException } from '@nestjs/common';
import { RoleType } from '@prisma/client';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler
  implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly orderService: OrderService,
  ) { }

  public async execute({
    id,
    user,
  }: GetOrderByIdQuery): Promise<GetOrderByIdResponse> {
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
            quantity: true,
            product: true,
            createdAt: true,
            discounts: {
              select: {
                discount: true
              }
            }
          },
        },
      },
    });

    if (order.user.id !== user.id && user.role != RoleType.ADMIN) {
      throw new BadRequestException('You are not allowed to view this order!');
    }

    return order;
  }
}
