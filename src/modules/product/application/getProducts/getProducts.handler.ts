import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { filterString } from 'src/common/utils/string';
import { PrismaService } from 'src/database';
import { GetProductsQueryResponse } from './getProducts.response';
import { GetProductsQuery } from './getProducts.query';
import { GetProductsRequestQuery } from './getProducts.request-query';
import * as _ from 'lodash';
import { GetProductOrderByEnum } from '../../product.enum';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
  }: GetProductsQuery): Promise<GetProductsQueryResponse> {
    const { perPage, page } = query;

    const { total, products } = await this.getProducts(query);

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: products,
    };

    return response as GetProductsQueryResponse;
  }

  private async getProducts(options: GetProductsRequestQuery) {
    const { search, skincareConcerns, page, perPage, order } = options;

    let whereCondition: Prisma.ProductWhereInput = {};

    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          {
            title: filterString(search),
          },
          {
            description: filterString(search),
          },
          {
            ingredientBenefits: filterString(search),
          },
          {
            fullIngredientsList: filterString(search),
          },
        ],
      };
    }

    if (skincareConcerns) {
      whereCondition = {
        ...whereCondition,
        skincareConcerns: {
          hasSome: skincareConcerns,
        },
      };
    }

    const [total, products] = await Promise.all([
      this.dbContext.product.count({
        where: {
          AND: whereCondition,
        },
      }),
      this.dbContext.product.findMany({
        where: {
          AND: whereCondition,
        },
        select: {
          id: true,
          thumbnail: true,
          additionalImages: true,
          price: true,
          currency: true,
          averageRating: true,
          title: true,
          description: true,
          howToUse: true,
          fullIngredientsList: true,
          skincareConcerns: true,
          ingredientBenefits: true,
          createdAt: true,
        },
        orderBy: this.getOrderBy(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, products };
  }

  private getOrderBy(order?: string): { [key: string]: any } {
    if (!order) {
      return {
        createdAt: Prisma.SortOrder.desc,
      };
    }
    const [field, direction] = order.split(':');

    switch (field) {
      case GetProductOrderByEnum.MOST_LOVED: {
        return { averageRating: Prisma.SortOrder.desc };
      }
      case GetProductOrderByEnum.BEST_SELLER: {
        return {
          orderItems: {
            _count: Prisma.SortOrder.desc
          }
        };
      }
      default:
        return { [field]: direction };
    }
  }
}
