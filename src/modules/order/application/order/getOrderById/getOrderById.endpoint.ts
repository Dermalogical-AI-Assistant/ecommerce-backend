import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrderByIdQuery } from './getOrderById.query';
import { GetOrderByIdRequestParam } from './getOrderById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Order')
@Controller({
  path: 'orders',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class GetOrderByIdEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get order by id' })
  @Get(':id')
  public get(
    @Param() { id }: GetOrderByIdRequestParam,
    @RequestUser() user: LoginUserDto
  ): Promise<void> {
    return this.queryBus.execute<GetOrderByIdQuery, void>(
      new GetOrderByIdQuery(id, user),
    );
  }
}
