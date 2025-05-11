import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddProductToWishlistRequestBody } from './addProductToWishlist.request-body';
import { AddProductToWishlistCommand } from './addProductToWishlist.command';
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
export class AddProductToWishlistEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Add a product to my wishlist' })
  @Post(':productId')
  public update(
    @Body() body: AddProductToWishlistRequestBody,
    @RequestUser() user: LoginUserDto,
  ): Promise<void> {
    console.log({ user });
    return this.commandBus.execute<AddProductToWishlistCommand, void>(
      new AddProductToWishlistCommand(user.id, body),
    );
  }
}
