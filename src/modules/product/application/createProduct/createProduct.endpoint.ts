import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductCommand } from './createProduct.command';
import { CreateProductRequestBody } from './createProduct.request-body';
import { RoleType } from '@prisma/client';
import { Role } from 'src/common/role/role.decorator';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class CreateProductEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create product' })
  @Post()
  public create(@Body() body: CreateProductRequestBody): Promise<void> {
    return this.commandBus.execute<CreateProductCommand, void>(new CreateProductCommand(body));
  }
}
