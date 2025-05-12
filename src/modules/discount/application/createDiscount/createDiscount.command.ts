import { CreateDiscountRequestBody } from './createDiscount.request-body';

export class CreateDiscountCommand {
  constructor(public readonly body: CreateDiscountRequestBody) {}
}
