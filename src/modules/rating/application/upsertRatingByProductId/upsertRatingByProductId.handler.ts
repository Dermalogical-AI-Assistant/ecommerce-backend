import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { UpsertRatingByProductIdCommand } from './upsertRatingByProductId.command';
import { NotFoundException } from '@nestjs/common';
import { getDateNow } from 'src/common/utils/date';
import { ProductService } from 'src/modules/product/services';

@CommandHandler(UpsertRatingByProductIdCommand)
export class UpsertRatingByProductIdHandler
  implements ICommandHandler<UpsertRatingByProductIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async execute(command: UpsertRatingByProductIdCommand): Promise<void> {
    const {
      userId,
      body: { productId, rating },
    } = command;

    await this.productService.validateProductExistsById(productId);

    await this.dbContext.rating.upsert({
      where: {
        userId_productId: {
          productId,
          userId,
        },
      },
      create: {
        productId,
        userId,
        rating,
      },
      update: {
        rating,
        createdAt: getDateNow()
      },
    });
  }
}
