import { AddProductToWishlistRequestBody } from './addProductToWishlist.request-body';

export class AddProductToWishlistCommand {
  constructor(
    public readonly userId: string,
    public readonly body: AddProductToWishlistRequestBody,
  ) {}
}
