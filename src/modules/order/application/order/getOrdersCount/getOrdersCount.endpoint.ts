import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrdersCountQuery } from './getOrdersCount.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetOrdersCountQueryResponse } from './getOrdersCount.response';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  path: 'orders-count',
  version: '1',
})
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetOrdersCountEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: 'Get orders count' })
  @Get()
  public get(): Promise<PaginatedOutputDto<GetOrdersCountQueryResponse>> {
    return this.queryBus.execute<
      GetOrdersCountQuery,
      PaginatedOutputDto<GetOrdersCountQueryResponse>
    >(new GetOrdersCountQuery());
  }
}
