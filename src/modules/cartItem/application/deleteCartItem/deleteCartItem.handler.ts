import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { DeleteCartItemCommand } from './deleteCartItem.command';
import { ProductService } from 'src/modules/product/services';

@CommandHandler(DeleteCartItemCommand)
export class DeleteWishlistByProductIdHandler
  implements ICommandHandler<DeleteCartItemCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute(command: DeleteCartItemCommand): Promise<void> {
    const { productId, userId } = command;

    await this.productService.validateProductExistsById(productId);

    await this.dbContext.cartItem.delete({
      where: {
        userId_productId: {
          productId,
          userId,
        },
      },
    });
  }
}
