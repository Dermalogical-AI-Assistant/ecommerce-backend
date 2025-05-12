import { GetMyShippingAddressesRequestQuery } from './getMyShippingAddresses.request-query';
export class GetMyShippingAddressesQuery {
  constructor(public readonly userId: string, public readonly query: GetMyShippingAddressesRequestQuery) {}
}
