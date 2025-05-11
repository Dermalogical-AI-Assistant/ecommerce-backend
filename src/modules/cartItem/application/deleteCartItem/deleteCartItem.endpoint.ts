import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteCartItemRequestParam } from './deleteCartItem.request-param';
import { DeleteCartItemCommand } from './deleteCartItem.command';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('CartItem')
@ApiBearerAuth()
@Controller({
  path: 'cart-items',
  version: '1',
})
@UseGuards(AuthenGuard)
export class DeleteCartItemEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete product out of my cart' })
  @Delete(':productId')
  public delete(@Param() { productId }: DeleteCartItemRequestParam, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<DeleteCartItemCommand, void>(new DeleteCartItemCommand(productId, user.id));
  }
}
