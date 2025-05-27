import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteDiscountByIdCommand } from './deleteDiscountById.command';
import { DeleteDiscountByIdRequestParam } from './deleteDiscountById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Discount')
@Controller({
  path: 'discounts',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class DeleteDiscountByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete discount by id' })
  @Delete(':id')
  public delete(
    @Param() { id }: DeleteDiscountByIdRequestParam,
    @RequestUser() user: LoginUserDto,
  ): Promise<void> {
    return this.commandBus.execute<DeleteDiscountByIdCommand, void>(
      new DeleteDiscountByIdCommand(id, user.id),
    );
  }
}
