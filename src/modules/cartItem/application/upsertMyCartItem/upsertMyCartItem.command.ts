import { UpsertMyCartItemRequestBody } from './upsertMyCartItem.request-body';

export class UpsertMyCartItemCommand {
  constructor(
    public readonly userId: string,
    public readonly body: UpsertMyCartItemRequestBody,
  ) {}
}
