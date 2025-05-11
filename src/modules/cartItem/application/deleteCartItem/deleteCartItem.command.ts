export class DeleteCartItemCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ) {}
}
