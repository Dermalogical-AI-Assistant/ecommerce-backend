import { UpdateShippingAddressByIdRequestBody } from './updateShippingAddressById.request-body';

export class UpdateShippingAddressByIdCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly body: UpdateShippingAddressByIdRequestBody,
  ) {}
}
