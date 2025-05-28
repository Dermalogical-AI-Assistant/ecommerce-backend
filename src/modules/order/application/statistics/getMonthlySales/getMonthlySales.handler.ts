import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { GetMonthlySalesQuery } from './getMonthlySales.query';
import { GetMonthlySalesQueryResponse } from './getMonthlySales.response';
import { getStartEndCurrentMonth } from 'src/common/utils/date';
import { OrderStatus } from '@prisma/client';

@QueryHandler(GetMonthlySalesQuery)
export class GetMonthlySalesHandler implements IQueryHandler<GetMonthlySalesQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(): Promise<GetMonthlySalesQueryResponse> {
    const { startOfCurrentMonth, endOfCurrentMonth } = getStartEndCurrentMonth();

    const [newSales, totalSales] = await Promise.all([
      this.dbContext.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
          paymentDate: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          }
        },
        _sum: { finalAmount: true }
      }),
      this.dbContext.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
        },
        _sum: { finalAmount: true }
      })
    ]);
    const newSalesAmount = newSales._sum.finalAmount;
    const totalSalesAmount = totalSales._sum.finalAmount;

    return {
      newSales: newSalesAmount,
      totalSales: totalSalesAmount,
      incrementalRate: newSalesAmount / totalSalesAmount * 100
    }
  }

}