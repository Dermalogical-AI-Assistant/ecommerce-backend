import { GetMyCartItemsRequestQuery } from "./getMyCartItems.request-query";

export class GetMyCartItemsQuery {
  constructor(
    public readonly userId: string,
    public readonly query: GetMyCartItemsRequestQuery,
  ) {}
}
