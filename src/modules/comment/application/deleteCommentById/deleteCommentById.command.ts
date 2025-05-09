export class DeleteCommentByIdCommand {
  constructor(public readonly id: string, public readonly userId: string) {}
}
