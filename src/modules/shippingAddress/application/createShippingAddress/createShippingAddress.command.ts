import { CreateShippingAddressRequestBody } from './createShippingAddress.request-body';

export class CreateShippingAddressCommand {
  constructor(
    public readonly userId: string,
    public readonly body: CreateShippingAddressRequestBody,
  ) {}
}
