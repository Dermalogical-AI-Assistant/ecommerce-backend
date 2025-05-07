import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { filterString } from 'src/common/utils/string';
import { PrismaService } from 'src/database';
import { GetNewsQueryResponse } from './getProducts.response';
import { GetProductsQuery } from './getProducts.query';
import { GetProductsRequestQuery } from './getProducts.request-query';
import { GetNewsOrderByEnum } from '../../product.enum';
import * as _ from 'lodash';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
  }: GetProductsQuery): Promise<GetNewsQueryResponse> {
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

    return response as GetNewsQueryResponse;
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
            fullIngredientsList: filterString(search),
          },
        ],
      };
    }

    if (skincareConcerns) {
      whereCondition = {
        ...whereCondition,
        skincareConcerns: {
          hasSome: skincareConcerns
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
          title: true,
          description: true,
          howToUse: true,
          fullIngredientsList: true,
          skincareConcerns: true,
          ingredientBenefits: true,
          createdAt: true,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, products };
  }
}
