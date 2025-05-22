import { UpsertListCartItemsRequestBody } from './upsertListCartItems.request-body';

export class CreateListOrderItemsCommand {
  constructor(public readonly userId: string, public readonly body: UpsertListCartItemsRequestBody) {}
}
