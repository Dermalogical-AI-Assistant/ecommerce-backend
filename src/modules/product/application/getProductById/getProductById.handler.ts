import { GetProductByIdQuery } from './getProductById.query';
import { GetProductByIdQueryResponse } from './getProductById.response';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import * as _ from 'lodash';
import { ProductService } from '../../services';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler
  implements IQueryHandler<GetProductByIdQuery>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute({
    id,
  }: GetProductByIdQuery): Promise<GetProductByIdQueryResponse> {
    const product = await this.productService.validateProductExistsById(id);
    return product;
  }
}
