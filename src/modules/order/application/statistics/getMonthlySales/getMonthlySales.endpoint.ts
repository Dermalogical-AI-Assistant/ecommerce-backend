import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMonthlySalesQuery } from './getMonthlySales.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetMonthlySalesQueryResponse } from './getMonthlySales.response';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  path: 'sales-monthly',
  version: '1',
})
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetMonthlySalesEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: 'Get monthly sales' })
  @Get()
  public get(): Promise<PaginatedOutputDto<GetMonthlySalesQueryResponse>> {
    return this.queryBus.execute<
      GetMonthlySalesQuery,
      PaginatedOutputDto<GetMonthlySalesQueryResponse>
    >(new GetMonthlySalesQuery());
  }
}
