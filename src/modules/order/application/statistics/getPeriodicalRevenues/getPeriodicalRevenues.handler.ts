import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { GetPeriodicalRevenuesQuery } from './getPeriodicalRevenues.query';
import { GetPeriodicalRevenuesQueryResponse, RevenueDto } from './getPeriodicalRevenues.response';
import { GetPeriodicalRevenuesRequestType } from 'src/modules/order/order.enum';
import { OrderStatus } from '@prisma/client';
import { getDateNow } from 'src/common/utils/date';

@QueryHandler(GetPeriodicalRevenuesQuery)
export class GetPeriodicalRevenuesHandler implements IQueryHandler<GetPeriodicalRevenuesQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute({ query: { type } }: GetPeriodicalRevenuesQuery): Promise<GetPeriodicalRevenuesQueryResponse> {
    if (type == GetPeriodicalRevenuesRequestType.ANNUALLY) {
      const data = await this.getAnnualRevenues();
      return { data };
    }
    const data = await this.getMonthlyRevenues();
    return { data };
    return;
  }

  private async getAnnualRevenues(): Promise<RevenueDto[]> {
    const result = await this.dbContext.$queryRaw<
      RevenueDto[]
    >`SELECT EXTRACT(YEAR FROM "payment_date") AS time, SUM("final_amount") AS amount
     FROM "order" 
     WHERE "status" = 'DELIVERED'
     GROUP BY time
     ORDER BY time ASC`;

    return result; // [ { time: 2025, amount: 9045 } ]
  }

  private async getMonthlyRevenues(): Promise<RevenueDto[]> {
    const currentYear = getDateNow().getFullYear();
    console.log({ currentYear });

    const result = await this.dbContext.$queryRaw<
      RevenueDto[]
    >` SELECT 
      EXTRACT(MONTH FROM "payment_date") AS time, 
      SUM("final_amount") AS amount
    FROM "order"
    WHERE "status" = 'DELIVERED' 
      AND EXTRACT(YEAR FROM "payment_date") = ${currentYear}
    GROUP BY time
    ORDER BY time ASC`;

    return result;
  }

}