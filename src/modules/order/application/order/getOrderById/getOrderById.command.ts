
export class GetOrderByIdCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
