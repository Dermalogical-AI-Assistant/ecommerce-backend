import { GetCommentsByProductIdRequestQuery } from './getCommentsByProductId.request-query';

export class GetCommentsByProductIdQuery {
  constructor(public readonly productId: string, public readonly query: GetCommentsByProductIdRequestQuery) {}
}
