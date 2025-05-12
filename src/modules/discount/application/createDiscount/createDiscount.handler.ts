import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDiscountCommand } from './createDiscount.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountHandler
  implements ICommandHandler<CreateDiscountCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({ body }: CreateDiscountCommand): Promise<void> {
    const {
      title,
      description,
      startTime,
      endTime,
      publishDate,
      discountType,
      discountValue,
      minPrice,
      currency,
      skincareConcerns,
    } = body;

    await this.dbContext.discount.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        publishDate: publishDate ? new Date(publishDate) : null,
        discountType,
        discountValue,
        minPrice,
        currency,
        skincareConcerns,
      },
    });
  }
}
