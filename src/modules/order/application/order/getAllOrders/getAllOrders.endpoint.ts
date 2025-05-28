import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllOrdersQuery } from './getAllOrders.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetAllOrdersQueryResponse } from './getAllOrders.response';
import { GetAllOrdersRequestQuery } from './getAllOrders.request-query';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  path: 'orders',
  version: '1',
})
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetAllOrdersEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all orders' })
  @Get()
  public get(
    @Query() query: GetAllOrdersRequestQuery,
  ): Promise<PaginatedOutputDto<GetAllOrdersQueryResponse>> {
    return this.queryBus.execute<
      GetAllOrdersQuery,
      PaginatedOutputDto<GetAllOrdersQueryResponse>
    >(new GetAllOrdersQuery(query));
  }
}
