import { UpsertRatingByProductIdRequestBody } from './upsertRatingByProductId.request-body';

export class UpsertRatingByProductIdCommand {
  constructor(
    public readonly userId: string,
    public readonly body: UpsertRatingByProductIdRequestBody,
  ) {}
}
