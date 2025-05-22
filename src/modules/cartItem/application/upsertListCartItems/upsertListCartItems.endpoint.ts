import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateListOrderItemsCommand } from './upsertListCartItems.command';
import { UpsertListCartItemsRequestBody } from './upsertListCartItems.request-body';
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
export class UpsertListCartItemsEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert list of cart items' })
  @Post()
  public create(@Body() body: UpsertListCartItemsRequestBody, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<CreateListOrderItemsCommand, void>( 
      new CreateListOrderItemsCommand(user.id, body),
    );
  }
}
