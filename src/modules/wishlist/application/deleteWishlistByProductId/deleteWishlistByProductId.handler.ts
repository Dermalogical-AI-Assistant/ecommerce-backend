import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { DeleteWishlistByProductIdCommand } from './deleteWishlistByProductId.command';
import { ProductService } from 'src/modules/product/services';
import { WishlistService } from '../../services/wishlist.service';

@CommandHandler(DeleteWishlistByProductIdCommand)
export class DeleteWishlistByProductIdHandler
  implements ICommandHandler<DeleteWishlistByProductIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
    private readonly wishlistService: WishlistService,
  ) {}

  public async execute(
    command: DeleteWishlistByProductIdCommand,
  ): Promise<void> {
    const { productId, userId } = command;

    await this.validate(command);

    await this.dbContext.wishlist.delete({
      where: {
        userId_productId: {
          productId,
          userId,
        },
      },
    });
  }

  private async validate({
    userId,
    productId,
  }: DeleteWishlistByProductIdCommand) {
    await Promise.all([
      this.productService.validateProductExistsById(productId),
      this.wishlistService.validateWishlistExists({ userId, productId }),
    ]);
  }
}
