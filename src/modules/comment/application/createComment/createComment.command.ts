import { CreateCommentRequestBody } from './createComment.request-body';

export class CreateCommentCommand {
  constructor(public readonly userId: string, public readonly body: CreateCommentRequestBody) {}
}
