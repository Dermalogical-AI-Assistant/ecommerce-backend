import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteWishlistByProductIdRequestParam } from './deleteWishlistByProductId.request-param';
import { DeleteWishlistByProductIdCommand } from './deleteWishlistByProductId.command';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller({
  path: 'wishlists',
  version: '1',
})
@UseGuards(AuthenGuard)
export class DeleteWishlistByProductIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete product out of my wishlist' })
  @Delete(':productId')
  public delete(@Param() { productId }: DeleteWishlistByProductIdRequestParam, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<DeleteWishlistByProductIdCommand, void>(new DeleteWishlistByProductIdCommand(productId, user.id));
  }
}
