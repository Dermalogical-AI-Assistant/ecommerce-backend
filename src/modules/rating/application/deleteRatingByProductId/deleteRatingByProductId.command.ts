export class DeleteRatingByProductIdCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ) {}
}
