import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDiscountByIdCommand } from './deleteDiscountById.command';
import { PrismaService } from 'src/database';
import { DiscountService } from '../../services';

@CommandHandler(DeleteDiscountByIdCommand)
export class DeleteDiscountByIdHandler
  implements ICommandHandler<DeleteDiscountByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly discountService: DiscountService,
  ) {}

  public async execute({
    id,
    userId,
  }: DeleteDiscountByIdCommand): Promise<void> {
    await this.discountService.validateDiscountExistsById(id);
    await this.dbContext.discount.delete({ where: { id } });
  }
}
