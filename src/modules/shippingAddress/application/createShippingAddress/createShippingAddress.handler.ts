import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShippingAddressCommand } from './createShippingAddress.command';
import { PrismaService } from 'src/database';
import { ShippingAddressService } from '../../services';

@CommandHandler(CreateShippingAddressCommand)
export class CreateShippingAddressHandler
  implements ICommandHandler<CreateShippingAddressCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  public async execute({
    userId,
    body,
  }: CreateShippingAddressCommand): Promise<void> {
    const { phone, address, district, city, country, postalCode, isDefault } =
      body;

    const shippingAddress = await this.dbContext.shippingAddress.create({
      data: {
        userId,
        phone,
        address,
        district,
        city,
        country,
        postalCode,
        isDefault,
      },
      select: {
        id: true,
      },
    });

    if (isDefault) {
      await this.shippingAddressService.changeMyDefaultShippingAddress({
        userId,
        shippingAddressId: shippingAddress.id,
      });
    }
  }
}
