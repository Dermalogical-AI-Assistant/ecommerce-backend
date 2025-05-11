import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertMyCartItemRequestBody } from './upsertMyCartItem.request-body';
import { UpsertMyCartItemCommand } from './upsertMyCartItem.command';
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
export class UpsertMyCartItemEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert my cart item' })
  @Post(':productId')
  public update(@Body() body: UpsertMyCartItemRequestBody, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<UpsertMyCartItemCommand, void>(new UpsertMyCartItemCommand(user.id, body));
  }
}
