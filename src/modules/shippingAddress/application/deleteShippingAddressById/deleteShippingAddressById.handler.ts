import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteShippingAddressByIdCommand } from './deleteShippingAddressById.command';
import { PrismaService } from 'src/database';
import { ShippingAddressService } from '../../services';

@CommandHandler(DeleteShippingAddressByIdCommand)
export class DeleteShippingAddressByIdHandler
  implements ICommandHandler<DeleteShippingAddressByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  public async execute({
    id,
    userId,
  }: DeleteShippingAddressByIdCommand): Promise<void> {
    await this.shippingAddressService.validateShippingAddress(id, userId);
    await this.dbContext.shippingAddress.delete({ where: { id } });
  }
}
