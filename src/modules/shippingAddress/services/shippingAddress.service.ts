import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';

@Injectable()
export class ShippingAddressService {
  constructor(private readonly dbContext: PrismaService) {}

  public async validateShippingAddress(id: string, userId: string) {
    const shippingAddress = await this.dbContext.shippingAddress.findUnique({
      where: { id },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found!');
    }

    if (shippingAddress.userId != userId) {
      throw new BadRequestException("You are not allowed to manage other's shipping address");
    }

    return shippingAddress;
  }

  public async changeMyDefaultShippingAddress(options: {
    userId: string;
    shippingAddressId: string;
  }) {
    const { userId, shippingAddressId } = options;
    await Promise.all([
      this.dbContext.shippingAddress.update({
        where: {
          id: shippingAddressId,
        },
        data: {
          isDefault: true,
        },
      }),

      this.dbContext.shippingAddress.updateMany({
        where: {
          userId,
          id: {
            not: shippingAddressId,
          },
        },
        data: {
          isDefault: false,
        },
      }),
    ]);
  }
}
