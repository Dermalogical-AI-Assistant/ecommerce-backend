import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { UpsertMyCartItemCommand } from './upsertMyCartItem.command';
import { ProductService } from 'src/modules/product/services';

@CommandHandler(UpsertMyCartItemCommand)
export class UpsertMyCartItemHandler
  implements ICommandHandler<UpsertMyCartItemCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute(command: UpsertMyCartItemCommand): Promise<void> {
    const {
      userId,
      body: { productId, quantity },
    } = command;

    await this.productService.validateProductExistsById(productId);

    await this.dbContext.cartItem.upsert({
      where: {
        userId_productId: {
          userId, productId
        }
      },
      create: {
        productId,
        userId,
        quantity
      },
      update: {
        quantity
      }
    });
  }
}
