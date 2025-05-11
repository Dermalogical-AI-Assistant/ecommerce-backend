import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRatingsByProductIdQuery } from './getRatingsByProductId.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetRatingsByProductIdRequestParam } from './getRatingsByProductId.request-param';
import { GetRatingsByProductIdQueryResponse } from './getRatingsByProductId.response';
import { GetRatingsByProductIdRequestQuery } from './getRatingsByProductId.request-query';

@ApiTags('Rating')
@Controller({
  path: 'ratings',
  version: '1',
})
export class GetRatingsByProductIdEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all ratings by the specified product' })
  @Get(':productId')
  public get(
    @Param() { productId }: GetRatingsByProductIdRequestParam,
    @Query() query: GetRatingsByProductIdRequestQuery,
  ): Promise<PaginatedOutputDto<GetRatingsByProductIdQueryResponse>> {
    return this.queryBus.execute<
      GetRatingsByProductIdQuery,
      PaginatedOutputDto<GetRatingsByProductIdQueryResponse>
    >(new GetRatingsByProductIdQuery(productId, query));
  }
}
