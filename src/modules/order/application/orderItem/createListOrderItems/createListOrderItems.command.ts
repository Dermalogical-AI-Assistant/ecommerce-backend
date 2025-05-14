import { CreateListOrderItemsRequestBody } from './createListOrderItems.request-body';

export class CreateListOrderItemsCommand {
  constructor(public readonly userId: string, public readonly body: CreateListOrderItemsRequestBody) {}
}
