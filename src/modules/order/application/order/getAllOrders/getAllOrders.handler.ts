import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma, $Enums } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetAllOrdersQuery } from './getAllOrders.query';
import { GetAllOrdersQueryResponse } from './getAllOrders.response';
import * as _ from 'lodash';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
  }: GetAllOrdersQuery): Promise<GetAllOrdersQueryResponse> {
    const { perPage, page } = query;

    const { total, orders } = await this.getMyOrders({
      query,
    });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: orders,
    };

    return response as GetAllOrdersQueryResponse;
  }

  private async getMyOrders(options: GetAllOrdersQuery) {
    const {
      query: { page, perPage, order, status },
    } = options;

    // Build where condition
    const whereCondition: Prisma.OrderWhereInput = {
      ...(status && { status: status as $Enums.OrderStatus }),
    };

    const [total, orders] = await Promise.all([
      this.dbContext.order.count({
        where: whereCondition,
      }),
      this.dbContext.order.findMany({
        where: whereCondition,
        select: {
          id: true,
          shippingAddress: true,
          shippingFee: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          totalAmount: true,
          totalDiscount: true,
          finalAmount: true,
          createdAt: true,
          orderItems: {
            select: {
                id: true,
                discountAmount: true,
                finalPrice: true,
                originalPrice: true,
                note: true,
                quantity: true,
                product: true,
                createdAt: true,
                discounts: {
                  select: {
                    discount: true
                  }
                }
              },
            },
          },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, orders };
  }
}