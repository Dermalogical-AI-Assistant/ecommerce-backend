import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateOrderByIdCommand } from './updateOrderById.command';
import { UpdateOrderByIdRequestBody } from './updateOrderById.request-body';
import { UpdateOrderByIdRequestParam } from './updateOrderById.request-param';
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
export class UpdateOrderByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update order by id' })
  @Put(':id')
  public update(
    @Param() { id }: UpdateOrderByIdRequestParam,
    @Body() body: UpdateOrderByIdRequestBody,
    @RequestUser() user: LoginUserDto
  ): Promise<void> {
    return this.commandBus.execute<UpdateOrderByIdCommand, void>(
      new UpdateOrderByIdCommand(id, user.id, body),
    );
  }
}
