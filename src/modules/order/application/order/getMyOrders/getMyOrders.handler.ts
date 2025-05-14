import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetMyOrdersQuery } from './getMyOrders.query';
import { GetMyOrdersQueryResponse } from './getMyOrders.response';
import * as _ from 'lodash';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetMyOrdersQuery)
export class GetMyOrdersHandler implements IQueryHandler<GetMyOrdersQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
    userId,
  }: GetMyOrdersQuery): Promise<GetMyOrdersQueryResponse> {
    const { perPage, page } = query;

    const { total, orders } = await this.getMyOrders({
      query,
      userId,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: orders,
    };

    return response as GetMyOrdersQueryResponse;
  }

  private async getMyOrders(options: GetMyOrdersQuery) {
    const {
      userId,
      query: { page, perPage, order },
    } = options;

    const [total, orders] = await Promise.all([
      this.dbContext.order.count({
        where: { userId },
      }),
      this.dbContext.order.findMany({
        where: { userId },
        select: {
          id: true,
          shippingAddress: true,
          shippingFee: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          totalAmount: true,
          totalDiscount: true,
          finalAmount: true,
          createdAt: true,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, orders };
  }
}
