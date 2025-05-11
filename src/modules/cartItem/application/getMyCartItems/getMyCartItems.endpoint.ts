import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMyCartItemsQuery } from './getMyCartItems.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetMyCartItemsQueryResponse } from './getMyCartItems.response';
import { GetMyCartItemsRequestQuery } from './getMyCartItems.request-query';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('CartItem')
@ApiBearerAuth()
@Controller({
  path: 'my-cart-items',
  version: '1',
})
@UseGuards(AuthenGuard)
export class GetMyCartItemsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get products in my cart' })
  @Get()
  public get(
    @Query() query: GetMyCartItemsRequestQuery,
    @RequestUser() user: LoginUserDto
  ): Promise<PaginatedOutputDto<GetMyCartItemsQueryResponse>> {
    return this.queryBus.execute<
      GetMyCartItemsQuery,
      PaginatedOutputDto<GetMyCartItemsQueryResponse>
    >(new GetMyCartItemsQuery(user.id, query));
  }
}
