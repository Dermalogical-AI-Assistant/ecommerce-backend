import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { AddProductToWishlistCommand } from './addProductToWishlist.command';
import { ProductService } from 'src/modules/product/services';
import { WishlistService } from '../../services/wishlist.service';

@CommandHandler(AddProductToWishlistCommand)
export class AddProductToWishlistHandler
  implements ICommandHandler<AddProductToWishlistCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
    private readonly wishlistService: WishlistService,
  ) {}

  public async execute(command: AddProductToWishlistCommand): Promise<void> {
    const {
      userId,
      body: { productId },
    } = command;

    await this.validate(command);

    await this.dbContext.wishlist.create({
      data: {
        productId,
        userId,
      },
    });
  }

  private async validate({
    userId,
    body: { productId },
  }: AddProductToWishlistCommand) {
    await Promise.all([
      this.productService.validateProductExistsById(productId),
      this.wishlistService.validateWishlistExists({ userId, productId }, true),
    ]);
  }
}
