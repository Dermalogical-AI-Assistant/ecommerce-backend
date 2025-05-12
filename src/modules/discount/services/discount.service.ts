import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';

@Injectable()
export class DiscountService {
  constructor(private readonly dbContext: PrismaService) {}

  public async validateDiscountExistsById(id: string) {
    const discount = await this.dbContext.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Discount not found!');
    }

    return discount;
  }
}
