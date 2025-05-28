import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { GetOrdersCountQuery } from './getOrdersCount.query';
import { GetOrdersCountQueryResponse } from './getOrdersCount.response';
import * as _ from 'lodash';

@QueryHandler(GetOrdersCountQuery)
export class GetOrdersCountHandler implements IQueryHandler<GetOrdersCountQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(_query: GetOrdersCountQuery): Promise<GetOrdersCountQueryResponse> {
    const ordersCount = await this.dbContext.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const data = ordersCount.map(g => ({
      status: g.status,
      count: g._count.status
    }));

    return { data };
  }

}