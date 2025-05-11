import { GetRatingsByProductIdRequestQuery } from "./getRatingsByProductId.request-query";

export class GetRatingsByProductIdQuery {
  constructor(
    public readonly productId: string,
    public readonly query: GetRatingsByProductIdRequestQuery,
  ) {}
}
