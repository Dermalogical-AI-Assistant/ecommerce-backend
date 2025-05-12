import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateDiscountByIdCommand } from './updateDiscountById.command';
import { UpdateDiscountByIdRequestBody } from './updateDiscountById.request-body';
import { UpdateDiscountByIdRequestParam } from './updateDiscountById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('Discount')
@Controller({
  path: 'discounts',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class UpdateDiscountByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update discount by id' })
  @Put(':id')
  public update(
    @Param() { id }: UpdateDiscountByIdRequestParam,
    @Body() body: UpdateDiscountByIdRequestBody,
  ): Promise<void> {
    return this.commandBus.execute<UpdateDiscountByIdCommand, void>(
      new UpdateDiscountByIdCommand(id, body),
    );
  }
}
