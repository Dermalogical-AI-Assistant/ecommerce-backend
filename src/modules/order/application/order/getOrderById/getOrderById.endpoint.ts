import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrderByIdCommand } from './getOrderById.command';
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
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Get order by id' })
  @Get(':id')
  public get(
    @Param() { id }: GetOrderByIdRequestParam,
    @RequestUser() user: LoginUserDto
  ): Promise<void> {
    return this.commandBus.execute<GetOrderByIdCommand, void>(
      new GetOrderByIdCommand(id, user.id),
    );
  }
}
