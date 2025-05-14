import { GetMyOrdersRequestQuery } from "./getMyOrders.request-query";

export class GetMyOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly query: GetMyOrdersRequestQuery,
  ) {}
}
