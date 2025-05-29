import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDiscountByIdCommand } from './getDiscountById.command';
import { GetDiscountByIdRequestParam } from './getOrderById.request-param';


@ApiTags('Discount')
@Controller({
  path: 'discounts',
  version: '1',
})
export class GetDiscountByIdEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Get discount by id' })
  @Get(':id')
  public get(@Param() { id }: GetDiscountByIdRequestParam): Promise<void> {
    return this.commandBus.execute<GetDiscountByIdCommand, void>(
      new GetDiscountByIdCommand(id),
    );
  }
}
