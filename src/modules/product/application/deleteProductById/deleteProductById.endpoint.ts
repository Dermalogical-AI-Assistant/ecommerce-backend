import { Controller, Delete, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteProductByIdRequestParam } from './deleteProductById.request-param';
import { DeleteProductByIdCommand } from './deleteProductById.command';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class DeleteProductByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete product by id' })
  @Delete(':id')
  public delete(@Param() { id }: DeleteProductByIdRequestParam): Promise<void> {
    return this.commandBus.execute<DeleteProductByIdCommand, void>(new DeleteProductByIdCommand(id));
  }
}
