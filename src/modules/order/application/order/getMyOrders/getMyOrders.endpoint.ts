import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMyOrdersQuery } from './getMyOrders.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetMyOrdersQueryResponse } from './getMyOrders.response';
import { GetMyOrdersRequestQuery } from './getMyOrders.request-query';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  path: 'my-orders',
  version: '1',
})
@UseGuards(AuthenGuard)
export class GetMyOrdersEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get my orders' })
  @Get()
  public get(
    @Query() query: GetMyOrdersRequestQuery,
    @RequestUser() user: LoginUserDto
  ): Promise<PaginatedOutputDto<GetMyOrdersQueryResponse>> {
    return this.queryBus.execute<
      GetMyOrdersQuery,
      PaginatedOutputDto<GetMyOrdersQueryResponse>
    >(new GetMyOrdersQuery(user.id, query));
  }
}
