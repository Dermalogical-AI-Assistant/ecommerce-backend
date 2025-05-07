import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {  ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductByIdQuery } from './getProductById.query';
import { GetProductByIdRequestParam } from './getProductById.request-param';
import { GetProductByIdQueryResponse } from './getProductById.response';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
export class GetProductByIdEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get product by id' })
  @Get(':id')
  public get(@Param() { id }: GetProductByIdRequestParam): Promise<GetProductByIdQueryResponse> {
    return this.queryBus.execute<GetProductByIdQuery, GetProductByIdQueryResponse>(new GetProductByIdQuery(id));
  }
}
