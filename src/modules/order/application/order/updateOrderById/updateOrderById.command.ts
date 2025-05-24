import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { UpdateOrderByIdRequestBody } from './updateOrderById.request-body';

export class UpdateOrderByIdCommand {
  constructor(
    public readonly id: string,
    public readonly user: LoginUserDto,
    public readonly body: UpdateOrderByIdRequestBody,
  ) {}
}
