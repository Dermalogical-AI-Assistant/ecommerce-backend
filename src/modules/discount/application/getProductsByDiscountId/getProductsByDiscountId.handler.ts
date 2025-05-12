import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetProductsByDiscountIdQuery } from './getProductsByDiscountId.query';
import { GetProductsByDiscountIdQueryResponse } from './getProductsByDiscountId.response';
import * as _ from 'lodash';
import { getOrderByDefault } from 'src/common/utils/order';
import { filterString } from 'src/common/utils/string';
import { GetProductOrderByEnum } from 'src/modules/product/product.enum';

@QueryHandler(GetProductsByDiscountIdQuery)
export class GetProductsByDiscountIdHandler
  implements IQueryHandler<GetProductsByDiscountIdQuery>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    discountId,
    query,
  }: GetProductsByDiscountIdQuery): Promise<GetProductsByDiscountIdQueryResponse> {
    const { perPage, page } = query;

    const { total, products } = await this.getProductsByDiscountId({
      discountId,
      query,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: products,
    };

    return response as GetProductsByDiscountIdQueryResponse;
  }

  private async getProductsByDiscountId({
    discountId,
    query,
  }: GetProductsByDiscountIdQuery) {
    const { search, page, perPage, order } = query;

    const discount = await this.dbContext.discount.findUnique({
      where: {
        id: discountId,
      },
      select: {
        minPrice: true,
        currency: true,
        skincareConcerns: true,
        publishDate: true,
      },
    });

    const andWhereConditions: Prisma.Enumerable<Prisma.ProductWhereInput> = [
      {
        currency: discount?.currency,
        price:
          discount?.currency && discount?.minPrice
            ? {
                gte: discount.minPrice,
              }
            : undefined,
        skincareConcerns: discount.skincareConcerns?.length
          ? {
              hasSome: discount.skincareConcerns,
            }
          : undefined,
        createdAt: discount.publishDate
          ? {
              gte: discount.publishDate,
            }
          : undefined,
      },
    ];

    if (search) {
      andWhereConditions.push({
        OR: [
          {
            title: filterString(search),
          },
          {
            description: filterString(search),
          },
          {
            fullIngredientsList: filterString(search),
          },
          {
            ingredientBenefits: filterString(search),
          },
        ],
      });
    }

    const [total, products] = await Promise.all([
      this.dbContext.product.count({
        where: {
          AND: andWhereConditions,
        },
      }),
      this.dbContext.product.findMany({
        where: {
          AND: andWhereConditions,
        },
        orderBy: getOrderByDefault(order),
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
