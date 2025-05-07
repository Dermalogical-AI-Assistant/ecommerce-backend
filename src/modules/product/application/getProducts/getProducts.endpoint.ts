import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetProductsQuery } from './getProducts.query';
import { GetProductsRequestQuery } from './getProducts.request-query';
import { GetNewsQueryResponse } from './getProducts.response';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
export class GetProductsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all products' })
  @Get()
  public get(@Query() query: GetProductsRequestQuery): Promise<PaginatedOutputDto<GetNewsQueryResponse>> {
    return this.queryBus.execute<GetProductsQuery, PaginatedOutputDto<GetNewsQueryResponse>>(new GetProductsQuery(query));
  }
}
