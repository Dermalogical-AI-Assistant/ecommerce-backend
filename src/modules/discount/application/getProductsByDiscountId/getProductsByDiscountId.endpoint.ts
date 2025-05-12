import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductsByDiscountIdQuery } from './getProductsByDiscountId.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetProductsByDiscountIdQueryResponse } from './getProductsByDiscountId.response';
import { GetProductsByDiscountIdRequestQuery } from './getProductsByDiscountId.request-query';
import { GetProductsByDiscountIdRequestParam } from './getProductsByDiscountId.request-param';

@ApiTags('Discount')
@Controller({
  path: 'discount-products/',
  version: '1',
})
export class GetProductsByDiscountIdEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all products by discount id' })
  @Get(':discountId')
  public get(
    @Param() { discountId }: GetProductsByDiscountIdRequestParam,
    @Query() query: GetProductsByDiscountIdRequestQuery,
  ): Promise<PaginatedOutputDto<GetProductsByDiscountIdQueryResponse>> {
    return this.queryBus.execute<
      GetProductsByDiscountIdQuery,
      PaginatedOutputDto<GetProductsByDiscountIdQueryResponse>
    >(new GetProductsByDiscountIdQuery(discountId, query));
  }
}
