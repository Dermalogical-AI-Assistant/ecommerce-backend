import { UpdateCommentByIdRequestBody } from './updateCommentById.request-body';

export class UpdateCommentByIdCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly body: UpdateCommentByIdRequestBody,
  ) {}
}
