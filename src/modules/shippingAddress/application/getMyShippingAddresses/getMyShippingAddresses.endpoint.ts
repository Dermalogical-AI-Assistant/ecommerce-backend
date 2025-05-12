import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetMyShippingAddressesQuery } from "./getMyShippingAddresses.query";
import { GetMyShippingAddressesRequestQuery } from "./getMyShippingAddresses.request-query";
import { GetMyShippingAddressesQueryResponse } from "./getMyShippingAddresses.response";
import { PaginatedOutputDto } from "src/common/dto/pageOutput.dto";
import { Role } from "src/common/role/role.decorator";
import { RoleType } from "@prisma/client";
import { RoleGuard } from "src/common/role/role.guard";
import { AuthenGuard } from "src/common/guard/authen.guard";
import { RequestUser } from "src/common/decorator/requestUser.decorator";
import { LoginUserDto } from "src/common/dto/loginUser.dto";

@ApiTags("ShippingAddress")
@Controller({
  path: "my-shipping-addreses",
  version: "1",
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class GetMyShippingAddressesEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: "Get my shipping addresses" })
  @Get()
  public get(
    @Query() query: GetMyShippingAddressesRequestQuery,
    @RequestUser() user: LoginUserDto
  ): Promise<PaginatedOutputDto<GetMyShippingAddressesQueryResponse>> {
    return this.queryBus.execute<
      GetMyShippingAddressesQuery,
      PaginatedOutputDto<GetMyShippingAddressesQueryResponse>
    >(new GetMyShippingAddressesQuery(user.id, query));
  }
}
