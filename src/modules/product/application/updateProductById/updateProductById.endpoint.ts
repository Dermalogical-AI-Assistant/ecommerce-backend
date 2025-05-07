import { Body, Controller, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';
import { UpdateProductByIdRequestBody } from './updateProductById.request-body';
import { UpdateProductByIdRequestParam } from './updateProductById.request-param';
import { UpdateProductByIdCommand } from './updateProductById.command';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard,RoleGuard)
@Role(RoleType.ADMIN)
export class UpdateProductByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update product by id' })
  @Put(':id')
  public update(@Param() { id }: UpdateProductByIdRequestParam, @Body() body: UpdateProductByIdRequestBody): Promise<void> {
    return this.commandBus.execute<UpdateProductByIdCommand, void>(new UpdateProductByIdCommand(id, body));
  }
}
