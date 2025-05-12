import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDiscountCommand } from './createDiscount.command';
import { CreateDiscountRequestBody } from './createDiscount.request-body';
import { AuthenGuard } from 'src/common/guard/authen.guard';

@ApiTags('Discount')
@Controller({
  path: 'discounts',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class CreateDiscountEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create discount' })
  @Post()
  public create(@Body() body: CreateDiscountRequestBody): Promise<void> {
    return this.commandBus.execute<CreateDiscountCommand, void>(
      new CreateDiscountCommand(body),
    );
  }
}
