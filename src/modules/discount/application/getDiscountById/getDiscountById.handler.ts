import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetDiscountByIdCommand } from './getDiscountById.command';
import { PrismaService } from 'src/database';
import { DiscountService } from 'src/modules/discount/services';
import { GetDiscountByIdResponse } from './getDiscountById.response';

@CommandHandler(GetDiscountByIdCommand)
export class GetDiscountByIdHandler
  implements ICommandHandler<GetDiscountByIdCommand> {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly discountService: DiscountService,
  ) { }

  public async execute({ id }: GetDiscountByIdCommand): Promise<GetDiscountByIdResponse> {
    const discount = await this.discountService.validateDiscountExistsById(id);
    return discount;
  }
}
