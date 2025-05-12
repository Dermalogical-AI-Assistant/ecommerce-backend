import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMyWishlistQuery } from './getMyWishlist.query';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetMyWishlistQueryResponse } from './getMyWishlist.response';
import { GetWishlistRequestQuery } from './getMyWishlist.request-query';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller({
  path: 'my-wishlists',
  version: '1',
})
@UseGuards(AuthenGuard)
export class GetWishlistEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get products in my wishlist' })
  @Get()
  public get(
    @Query() query: GetWishlistRequestQuery,
    @RequestUser() user: LoginUserDto
  ): Promise<PaginatedOutputDto<GetMyWishlistQueryResponse>> {
    return this.queryBus.execute<
      GetMyWishlistQuery,
      PaginatedOutputDto<GetMyWishlistQueryResponse>
    >(new GetMyWishlistQuery(user.id, query));
  }
}
