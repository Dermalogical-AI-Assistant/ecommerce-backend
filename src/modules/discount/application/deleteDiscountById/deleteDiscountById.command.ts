export class DeleteDiscountByIdCommand {
  constructor(public readonly id: string, public readonly userId: string) {}
}
