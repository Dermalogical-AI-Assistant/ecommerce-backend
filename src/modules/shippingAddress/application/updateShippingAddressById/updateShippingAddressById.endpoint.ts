import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateShippingAddressByIdCommand } from "./updateShippingAddressById.command";
import { UpdateShippingAddressByIdRequestBody } from "./updateShippingAddressById.request-body";
import { UpdateShippingAddressByIdRequestParam } from "./updateShippingAddressById.request-param";
import { RoleGuard } from "src/common/role/role.guard";
import { RoleType } from "@prisma/client";
import { Role } from "src/common/role/role.decorator";
import { AuthenGuard } from "src/common/guard/authen.guard";
import { RequestUser } from "src/common/decorator/requestUser.decorator";
import { LoginUserDto } from "src/common/dto/loginUser.dto";

@ApiTags("ShippingAddress")
@Controller({
  path: "shipping-addresses",
  version: "1",
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class UpdateShippingAddressByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: "Update shipping address by id" })
  @Put(":id")
  public update(
    @Param() { id }: UpdateShippingAddressByIdRequestParam,
    @Body() body: UpdateShippingAddressByIdRequestBody,
    @RequestUser() user: LoginUserDto
  ): Promise<void> {
    return this.commandBus.execute<UpdateShippingAddressByIdCommand, void>(
      new UpdateShippingAddressByIdCommand(id, user.id,  body)
    );
  }
}
