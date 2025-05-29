import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDiscountCommand } from './createDiscount.command';
import { PrismaService } from 'src/database';
import { DiscountDto } from 'src/generated';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountHandler
  implements ICommandHandler<CreateDiscountCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({ body }: CreateDiscountCommand): Promise<DiscountDto> {
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

    const discount = await this.dbContext.discount.create({
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
      select: {
        id: true,
        title: true,
        description: true,
        currency: true,
        discountType: true,
        discountValue: true,
        startTime: true,
        endTime: true,
        minPrice: true,
        publishDate: true,
        status: true,
        skincareConcerns: true,  
        createdAt: true,
      }
    });

    return discount;
  }
}
