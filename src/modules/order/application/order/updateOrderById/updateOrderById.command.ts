import { UpdateOrderByIdRequestBody } from './updateOrderById.request-body';

export class UpdateOrderByIdCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly body: UpdateOrderByIdRequestBody,
  ) {}
}
