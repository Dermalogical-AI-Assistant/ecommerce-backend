import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMonthlyOrdersQuery } from './getMonthlyOrders.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetMonthlyOrdersQueryResponse } from './getMonthlyOrders.response';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  path: 'orders-monthly',
  version: '1',
})
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetMonthlyOrdersEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: 'Get monthly orders' })
  @Get()
  public get(): Promise<PaginatedOutputDto<GetMonthlyOrdersQueryResponse>> {
    return this.queryBus.execute<
      GetMonthlyOrdersQuery,
      PaginatedOutputDto<GetMonthlyOrdersQueryResponse>
    >(new GetMonthlyOrdersQuery());
  }
}
