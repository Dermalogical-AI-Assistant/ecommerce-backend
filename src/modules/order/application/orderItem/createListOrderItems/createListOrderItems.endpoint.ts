import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateListOrderItemsCommand } from './createListOrderItems.command';
import { CreateListOrderItemsRequestBody } from './createListOrderItems.request-body';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Order')
@Controller({
  path: 'order-items',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class CreateListOrderItemsEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create list order items' })
  @Post()
  public create(@Body() body: CreateListOrderItemsRequestBody, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<CreateListOrderItemsCommand, void>( 
      new CreateListOrderItemsCommand(user.id, body),
    );
  }
}
