import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { UpdateShippingAddressByIdCommand } from './updateShippingAddressById.command';
import { UpdateShippingAddressByIdRequestBody } from './updateShippingAddressById.request-body';
import { PrismaService } from 'src/database';
import { ShippingAddressService } from '../../services';

@CommandHandler(UpdateShippingAddressByIdCommand)
export class UpdateShippingAddressByIdHandler
  implements ICommandHandler<UpdateShippingAddressByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  public async execute({
    id,
    userId,
    body,
  }: UpdateShippingAddressByIdCommand): Promise<void> {
    const { phone, address, district, city, country, postalCode, isDefault } =
      body;
    await this.shippingAddressService.validateShippingAddress(id, userId);
    await this.dbContext.shippingAddress.update({
      where: {
        id,
      },
      data: {
        phone,
        address,
        district,
        city,
        country,
        postalCode,
        isDefault,
      },
    });

    if (isDefault) {
      await this.shippingAddressService.changeMyDefaultShippingAddress({
        userId,
        shippingAddressId: id,
      });
    }
  }
}
