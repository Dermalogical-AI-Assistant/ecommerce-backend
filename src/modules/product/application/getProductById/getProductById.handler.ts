import { GetProductByIdQuery } from './getProductById.query';
import { GetProductByIdQueryResponse } from './getProductById.response';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import * as _ from 'lodash';
import { ProductService } from '../../services';
import { OrderStatus } from '@prisma/client';
import { PROCESSED_ORDER_STATUSES } from 'src/common/enum/order.enum';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler
  implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) { }

  public async execute({
    id,
  }: GetProductByIdQuery): Promise<GetProductByIdQueryResponse> {
    const product = await this.productService.validateProductExistsById(id);

    const soldQuantities = await this.dbContext.orderItem.groupBy({
      by: ['productId'],
      where: {
        productId: id,
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

    const soldQuantity = soldQuantities[0]?._sum.quantity ?? 0;

    return { ...product, soldQuantity };
  }
}
