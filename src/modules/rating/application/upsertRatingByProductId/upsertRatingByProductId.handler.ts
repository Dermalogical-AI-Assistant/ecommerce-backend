import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { UpsertRatingByProductIdCommand } from './upsertRatingByProductId.command';
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

    await this.dbContext.$transaction(async (tx) => {
      // Upsert rating
      await tx.rating.upsert({
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

      const avgResult = await tx.rating.aggregate({
        where: { productId },
        _avg: { rating: true },
      });

      const newAverageRating = avgResult._avg.rating || 0;

      await tx.product.update({
        where: { id: productId },
        data: { averageRating: newAverageRating },
      });
    });
  }
}