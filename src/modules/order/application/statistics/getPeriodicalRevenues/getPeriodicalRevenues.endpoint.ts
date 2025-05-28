import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPeriodicalRevenuesQuery } from './getPeriodicalRevenues.query';
import { GetPeriodicalRevenuesQueryResponse } from './getPeriodicalRevenues.response';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';
import { GetPeriodicalRevenuesRequestQuery } from './getPeriodicalRevenues.request-query';

@ApiTags('Order')
@Controller({
  path: 'periodical-revenues',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetPeriodicalRevenuesEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: 'Get periodical revenues' })
  @Get()
  public get(@Query() query: GetPeriodicalRevenuesRequestQuery): Promise<GetPeriodicalRevenuesQueryResponse> {
    return this.queryBus.execute<
      GetPeriodicalRevenuesQuery,
      GetPeriodicalRevenuesQueryResponse
    >(new GetPeriodicalRevenuesQuery(query));
  }
}
