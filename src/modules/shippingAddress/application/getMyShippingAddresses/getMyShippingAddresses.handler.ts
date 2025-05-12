import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetMyShippingAddressesQuery } from './getMyShippingAddresses.query';
import { GetMyShippingAddressesRequestQuery } from './getMyShippingAddresses.request-query';
import { GetMyShippingAddressesQueryResponse } from './getMyShippingAddresses.response';
import { filterString } from 'src/common/utils/string';
import { PrismaService } from 'src/database';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetMyShippingAddressesQuery)
export class GetMyShippingAddressesHandler
  implements IQueryHandler<GetMyShippingAddressesQuery>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    userId,
    query,
  }: GetMyShippingAddressesQuery): Promise<GetMyShippingAddressesQueryResponse> {
    const { perPage, page } = query;

    const { total, shippingAddresses } = await this.getMyShippingAddresses(query);

    const response = {
      meta: {
        page: page + 1,
        perPage,
        total,
      },
      data: shippingAddresses,
    };

    return response as GetMyShippingAddressesQueryResponse;
  }

  private async getMyShippingAddresses(options: GetMyShippingAddressesRequestQuery) {
    const { search, page, perPage, order } = options;

    const andWhereConditions: Prisma.Enumerable<Prisma.ShippingAddressWhereInput> =
      [];

    if (search) {
      andWhereConditions.push({
        OR: [
          {
            phone: filterString(search),
          },
          {
            address: filterString(search),
          },
          {
            district: filterString(search),
          },
          {
            city: filterString(search),
          },
          {
            country: filterString(search),
          },
        ],
      });
    }

    const [total, shippingAddresses] = await Promise.all([
      this.dbContext.shippingAddress.count({
        where: {
          AND: andWhereConditions,
        },
      }),
      this.dbContext.shippingAddress.findMany({
        where: {
          AND: andWhereConditions,
        },
        select: {
          id: true,
          phone: true,
          address: true,
          district: true,
          city: true,
          country: true,
          isDefault: true,
          postalCode: true,
          createdAt: true,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, shippingAddresses };
  }
}
