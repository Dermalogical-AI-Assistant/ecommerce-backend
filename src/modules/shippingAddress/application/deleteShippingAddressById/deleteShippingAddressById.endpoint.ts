import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteShippingAddressByIdCommand } from './deleteShippingAddressById.command';
import { DeleteShippingAddressByIdRequestParam } from './deleteShippingAddressById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('ShippingAddress')
@Controller({
  path: 'shipping-addresses',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class DeleteShippingAddressByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete shipping address by id' })
  @Delete(':id')
  public delete(
    @Param() { id }: DeleteShippingAddressByIdRequestParam,
    @RequestUser() user: LoginUserDto,
  ): Promise<void> {
    return this.commandBus.execute<DeleteShippingAddressByIdCommand, void>(
      new DeleteShippingAddressByIdCommand(id, user.id),
    );
  }
}
