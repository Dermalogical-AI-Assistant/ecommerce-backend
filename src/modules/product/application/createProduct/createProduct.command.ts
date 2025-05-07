import { CreateProductRequestBody } from './createProduct.request-body';

export class CreateProductCommand {
  constructor(public readonly body: CreateProductRequestBody) {}
}
