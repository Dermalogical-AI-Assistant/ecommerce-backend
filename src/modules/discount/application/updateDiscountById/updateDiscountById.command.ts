import { UpdateDiscountByIdRequestBody } from './updateDiscountById.request-body';

export class UpdateDiscountByIdCommand {
  constructor(
    public readonly id: string,
    public readonly body: UpdateDiscountByIdRequestBody,
  ) {}
}
