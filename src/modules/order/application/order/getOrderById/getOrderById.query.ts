import { LoginUserDto } from "src/common/dto/loginUser.dto";

export class GetOrderByIdQuery {
  constructor(
    public readonly id: string,
    public readonly user: LoginUserDto,
  ) {}
}
