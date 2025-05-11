import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { DeleteRatingByProductIdCommand } from './deleteRatingByProductId.command';
import { ProductService } from 'src/modules/product/services';

@CommandHandler(DeleteRatingByProductIdCommand)
export class DeleteRatingByProductIdHandler
  implements ICommandHandler<DeleteRatingByProductIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute(command: DeleteRatingByProductIdCommand): Promise<void> {
    const { productId, userId } = command;

    await this.productService.validateProductExistsById(productId);

    await this.dbContext.rating.delete({
      where: {
        userId_productId: {
          productId,
          userId,
        },
      },
    });
  }
}
