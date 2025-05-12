import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDiscountsQuery } from './getDiscounts.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetDiscountsQueryResponse } from './getDiscounts.response';
import { GetDiscountsRequestQuery } from './getDiscounts.request-query';

@ApiTags('Discount')
@Controller({
  path: 'discounts',
  version: '1',
})
export class GetDiscountsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all discounts' })
  @Get()
  public get(
    @Query() query: GetDiscountsRequestQuery,
  ): Promise<PaginatedOutputDto<GetDiscountsQueryResponse>> {
    return this.queryBus.execute<
      GetDiscountsQuery,
      PaginatedOutputDto<GetDiscountsQueryResponse>
    >(new GetDiscountsQuery(query));
  }
}
