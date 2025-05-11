import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetRatingsByProductIdQuery } from './getRatingsByProductId.query';
import { GetRatingsByProductIdQueryResponse } from './getRatingsByProductId.response';
import * as _ from 'lodash';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from 'src/modules/product/services';
import { GetRatingsOrderByEnum } from '../../rating.enum';

@QueryHandler(GetRatingsByProductIdQuery)
export class GetRatingsByProductIdHandler
  implements IQueryHandler<GetRatingsByProductIdQuery>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute({
    query,
    productId,
  }: GetRatingsByProductIdQuery): Promise<GetRatingsByProductIdQueryResponse> {
    const { perPage, page } = query;

    const { total, ratings } = await this.getReactions({
      query,
      productId,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: ratings,
    };

    return response as GetRatingsByProductIdQueryResponse;
  }

  private async getReactions(options: GetRatingsByProductIdQuery) {
    const {
      productId,
      query: { page, perPage, order },
    } = options;

    await this.productService.validateProductExistsById(productId);

    const whereCondition: Prisma.RatingWhereInput = { productId };

    const [total, ratings] = await Promise.all([
      this.dbContext.rating.count({
        where: whereCondition,
      }),
      this.dbContext.rating.findMany({
        where: {
          AND: whereCondition,
        },
        select: {
          rating: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: this.getOrderBy(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, ratings };
  }

  private getOrderBy(order?: string) {
    if (!order) {
      return {
        date: Prisma.SortOrder.desc,
      };
    }
    const [field, direction] = order.split(':');

    if (field === GetRatingsOrderByEnum.USER_NAME) {
      return {
        user: {
          name: direction as Prisma.SortOrder,
        },
      };
    }

    return { [field]: direction };
  }
}
