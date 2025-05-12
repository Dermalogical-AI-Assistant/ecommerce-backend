import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetDiscountsQuery } from './getDiscounts.query';
import { GetDiscountsQueryResponse } from './getDiscounts.response';
import * as _ from 'lodash';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetDiscountsQuery)
export class GetDiscountsHandler implements IQueryHandler<GetDiscountsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
  }: GetDiscountsQuery): Promise<GetDiscountsQueryResponse> {
    const { perPage, page } = query;

    const { total, discounts } = await this.getDiscounts({
      query,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: discounts,
    };

    return response as GetDiscountsQueryResponse;
  }

  private async getDiscounts(options: GetDiscountsQuery) {
    const {
      query: {
        page,
        perPage,
        order,
        statuses,
        discountTypes,
        skincareConcerns,
      },
    } = options;

    const andWhereConditions: Prisma.Enumerable<Prisma.DiscountWhereInput> = [];

    if (statuses?.length) {
      andWhereConditions.push({
        status: {
          in: statuses,
        },
      });
    }

    if (discountTypes?.length) {
      andWhereConditions.push({
        discountType: {
          in: discountTypes,
        },
      });
    }

    if (skincareConcerns?.length) {
      andWhereConditions.push({
        skincareConcerns: {
          hasSome: skincareConcerns 
        },
      });
    }

    const [total, discounts] = await Promise.all([
      this.dbContext.discount.count({
        where: {
          AND: andWhereConditions,
        },
      }),
      this.dbContext.discount.findMany({
        where: {
          AND: andWhereConditions,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, discounts };
  }
}
