import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetMyCartItemsQuery } from './getMyCartItems.query';
import { GetMyCartItemsQueryResponse } from './getMyCartItems.response';
import * as _ from 'lodash';
import { GeMyCartItemOrderByEnum } from '../../cartItem.enum';

@QueryHandler(GetMyCartItemsQuery)
export class GetMyCartItemsHandler implements IQueryHandler<GetMyCartItemsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
    userId,
  }: GetMyCartItemsQuery): Promise<GetMyCartItemsQueryResponse> {
    const { perPage, page } = query;

    const { total, cartItems } = await this.getProductsInMyCart({
      query,
      userId,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: cartItems,
    };

    return response as GetMyCartItemsQueryResponse;
  }

  private async getProductsInMyCart(options: GetMyCartItemsQuery) {
    const {
      userId,
      query: { page, perPage, order },
    } = options;

    const [total, cartItems] = await Promise.all([
      this.dbContext.cartItem.count({
        where: { userId },
      }),
      this.dbContext.cartItem.findMany({
        where: {
          userId,
        },
        select: {
          product: true,
          createdAt: true,
        },
        orderBy: this.getOrderBy(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, cartItems };
  }

  private getOrderBy(order?: string) {
    if (!order) {
      return {
        date: Prisma.SortOrder.desc,
      };
    }
    const [field, direction] = order.split(':');

    if (field === GeMyCartItemOrderByEnum.PRODUCT_TITLE) {
      return {
        product: {
          title: direction as Prisma.SortOrder,
        },
      };
    }

    return { [field]: direction };
  }
}
