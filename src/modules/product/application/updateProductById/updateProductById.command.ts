import { UpdateProductByIdRequestBody } from './updateProductById.request-body';

export class UpdateProductByIdCommand {
  constructor(
    public readonly id: string,
    public readonly body: UpdateProductByIdRequestBody,
  ) {}
}
