import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { filterString } from 'src/common/utils/string';
import { PrismaService } from 'src/database';
import { GetProductsQueryResponse, GetProductsResponse } from './getProducts.response';
import { GetProductsQuery } from './getProducts.query';
import { GetProductsRequestQuery } from './getProducts.request-query';
import * as _ from 'lodash';
import { GetProductOrderByEnum } from '../../product.enum';
import { PROCESSED_ORDER_STATUSES } from 'src/common/enum/order.enum';
import { ProductDto } from 'src/generated';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly dbContext: PrismaService) { }

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

    let whereCondition: Prisma.ProductWhereInput = { isDeleted: false };

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

    const orderBy = this.getOrderBy(order);
    const orderKey = Object.keys(orderBy)[0];

    const [total, products] = await Promise.all([
      this.dbContext.product.count({
        where: {
          AND: whereCondition,
        },
      }),
      orderKey == GetProductOrderByEnum.BEST_SELLER ?
        this.getBestSellerProducts(page, perPage) :
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
            totalQuantity: true,
            createdAt: true,
          },
          orderBy,
          skip: page * perPage,
          take: perPage,
        }),
    ]);

    const soldQuantities = await this.dbContext.orderItem.groupBy({
      by: ['productId'],
      where: {
        productId: {
          in: products.map(product => product.id),
        },
        order: {
          status: {
            in: PROCESSED_ORDER_STATUSES,
          },
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const mappedProducts: GetProductsResponse[] = products.map(p => ({
      ...p,
      soldQuantity: soldQuantities.find(sq => sq.productId == p.id)?._sum.quantity ?? 0
    }))

    return { total, products: mappedProducts };
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
      // case GetProductOrderByEnum.BEST_SELLER: {
      //   return {
      //     orderItems: {
      //       _count: Prisma.SortOrder.desc
      //     }
      //   };
      // }
      default:
        return { [field]: direction };
    }
  }

  private async getBestSellerProducts(page: number, perPage: number): Promise<ProductDto[]> {
    return this.dbContext.$queryRaw<ProductDto[]>`
      SELECT 
        p.id,
        p.thumbnail,
        p.additional_images,
        p.price,
        p.currency,
        p.average_rating,
        p.title,
        p.description,
        p.how_to_use,
        p.full_ingredients_list,
        p.skincare_concerns,
        p.ingredient_benefits,
        p.total_quantity,
        p.createdAt
      FROM "product" p
      JOIN (
        SELECT 
          oi."product_id" AS "productId",
          SUM(oi.quantity) AS totalSold
        FROM "order_item" oi
        JOIN "order" o ON oi."order_id" = o.id
        WHERE o.status IN (${Prisma.join(PROCESSED_ORDER_STATUSES)})
        GROUP BY oi."product_id"
      ) sold ON p.id = sold."productId"
      ORDER BY sold.totalSold DESC
      OFFSET ${page * perPage}
      LIMIT ${perPage}
    `;
  }
}
