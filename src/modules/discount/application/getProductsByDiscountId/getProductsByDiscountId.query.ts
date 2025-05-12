import { GetProductsByDiscountIdRequestQuery } from "./getProductsByDiscountId.request-query";

export class GetProductsByDiscountIdQuery {
  constructor(
    public readonly discountId: string,
    public readonly query: GetProductsByDiscountIdRequestQuery,
  ) {}
}
