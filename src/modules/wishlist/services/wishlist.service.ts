import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';

@Injectable()
export class WishlistService {
  constructor(private readonly dbContext: PrismaService) {}

  public async validateWishlistExists(conditions: {
    userId: string;
    productId: string;
  }, validateWhenCreate: boolean = false) {
    const wishlist = await this.dbContext.wishlist.findUnique({
      where: { userId_productId: conditions },
    });

    if (validateWhenCreate && wishlist) {
      throw new BadRequestException("This product in your wishlist already!")
    }

    if (!validateWhenCreate && !wishlist) {
      throw new NotFoundException('Wishlist not found!');
    }
    
    return wishlist;
  }
}
