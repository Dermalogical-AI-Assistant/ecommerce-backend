import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetCommentsByProductIdQuery } from './getCommentsByProductId.query';
import { GetCommentsByProductIdRequestQuery } from './getCommentsByProductId.request-query';
import { GetCommentsByProductIdQueryResponse } from './getCommentsByProductId.response';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetCommentsByProductIdRequestParam } from './getCommentsByProductId.request-param';

@ApiTags('Comment')
@Controller({
  path: 'comments-product',
  version: '1',
})
export class GetCommentsByProductIdEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all comments by the specified product' })
  @Get(':productId')
  public get(
    @Param() { productId }: GetCommentsByProductIdRequestParam,
    @Query() query: GetCommentsByProductIdRequestQuery, 
  ): Promise<PaginatedOutputDto<GetCommentsByProductIdQueryResponse>> {
    return this.queryBus.execute<
      GetCommentsByProductIdQuery, PaginatedOutputDto<GetCommentsByProductIdQueryResponse>
    >(new GetCommentsByProductIdQuery(productId, query));
  }
}
