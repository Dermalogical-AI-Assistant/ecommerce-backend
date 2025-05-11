import { GetWishlistRequestQuery } from "./getMyWishlist.request-query";

export class GetMyWishlistQuery {
  constructor(
    public readonly userId: string,
    public readonly query: GetWishlistRequestQuery,
  ) {}
}
