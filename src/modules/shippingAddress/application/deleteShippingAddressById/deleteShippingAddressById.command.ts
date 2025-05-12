export class DeleteShippingAddressByIdCommand {
  constructor(public readonly id: string, public readonly userId: string) {}
}
