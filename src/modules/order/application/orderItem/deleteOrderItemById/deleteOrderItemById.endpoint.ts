import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteOrderItemByIdCommand } from './deleteOrderItemById.command';
import { DeleteOrderItemByIdRequestParam } from './deleteOrderItemById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('Order')
@Controller({
  path: 'order-items',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class DeleteOrderItemByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete order item by id' })
  @Delete(':id')
  public delete(
    @Param() { id }: DeleteOrderItemByIdRequestParam,
  ): Promise<void> {
    return this.commandBus.execute<DeleteOrderItemByIdCommand, void>(
      new DeleteOrderItemByIdCommand(id),
    );
  }
}
