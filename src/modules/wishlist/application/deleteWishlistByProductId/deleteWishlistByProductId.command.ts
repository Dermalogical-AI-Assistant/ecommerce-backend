export class DeleteWishlistByProductIdCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ) {}
}
