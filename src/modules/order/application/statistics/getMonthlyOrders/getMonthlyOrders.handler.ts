import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetMonthlyOrdersQuery } from './getMonthlyOrders.query';
import { GetMonthlyOrdersQueryResponse } from './getMonthlyOrders.response';
import { getStartEndCurrentMonth } from 'src/common/utils/date';

@QueryHandler(GetMonthlyOrdersQuery)
export class GetMonthlyOrdersHandler implements IQueryHandler<GetMonthlyOrdersQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(): Promise<GetMonthlyOrdersQueryResponse> {
    const { startOfCurrentMonth, endOfCurrentMonth } = getStartEndCurrentMonth();

    const [newOrdersCount, totalOrdersCount] = await Promise.all([
      this.dbContext.order.count({
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        }
      }),
      this.dbContext.order.count({
        where: {
          status: OrderStatus.DELIVERED
        }
      }),
    ])
    return {
      newOrdersCount,
      totalOrdersCount,
      incrementalRate: newOrdersCount / totalOrdersCount * 100
    }
  }

}