import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateShippingAddressCommand } from "./createShippingAddress.command";
import { CreateShippingAddressRequestBody } from "./createShippingAddress.request-body";
import { AuthenGuard } from "src/common/guard/authen.guard";
import { LoginUserDto } from "src/common/dto/loginUser.dto";
import { RequestUser } from "src/common/decorator/requestUser.decorator";

@ApiTags("ShippingAddress")
@Controller({
  path: "shipping-addresses",
  version: "1",
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class CreateShippingAddressEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: "Create a shipping address for user" })
  @Post()
  public create(@Body() body: CreateShippingAddressRequestBody, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<CreateShippingAddressCommand, void>(
      new CreateShippingAddressCommand(user.id, body)
    );
  }
}
