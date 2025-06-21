import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDiscountByIdCommand } from './updateDiscountById.command';
import { PrismaService } from 'src/database';
import { DiscountService } from '../../services';
import { getEndOfDay } from 'src/common/utils/date';

@CommandHandler(UpdateDiscountByIdCommand)
export class UpdateDiscountByIdHandler
  implements ICommandHandler<UpdateDiscountByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly discountService: DiscountService,
  ) {}

  public async execute({ id, body }: UpdateDiscountByIdCommand): Promise<void> {
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
    await this.discountService.validateDiscountExistsById(id);
    await this.dbContext.discount.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? getEndOfDay(new Date(endTime)) : undefined,
        publishDate: endTime ? new Date(publishDate) : undefined,
        discountType,
        discountValue,
        minPrice,
        currency,
        skincareConcerns,
      },
    });
  }
}
