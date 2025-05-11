import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetMyWishlistQuery } from './getMyWishlist.query';
import { GetMyWishlistQueryResponse } from './getMyWishlist.response';
import * as _ from 'lodash';
import { GeMyWishlistOrderByEnum } from '../../wishlist.enum';

@QueryHandler(GetMyWishlistQuery)
export class GetMyWishlistHandler implements IQueryHandler<GetMyWishlistQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
    userId,
  }: GetMyWishlistQuery): Promise<GetMyWishlistQueryResponse> {
    const { perPage, page } = query;

    const { total, wishlists } = await this.getProductsInMyWishlist({
      query,
      userId,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: wishlists,
    };

    return response as GetMyWishlistQueryResponse;
  }

  private async getProductsInMyWishlist(options: GetMyWishlistQuery) {
    const {
      userId,
      query: { page, perPage, order },
    } = options;

    const [total, wishlists] = await Promise.all([
      this.dbContext.wishlist.count({
        where: { userId },
      }),
      this.dbContext.wishlist.findMany({
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

    return { total, wishlists };
  }

  private getOrderBy(order?: string) {
    if (!order) {
      return {
        date: Prisma.SortOrder.desc,
      };
    }
    const [field, direction] = order.split(':');

    if (field === GeMyWishlistOrderByEnum.PRODUCT_TITLE) {
      return {
        product: {
          title: direction as Prisma.SortOrder,
        },
      };
    }

    return { [field]: direction };
  }
}
