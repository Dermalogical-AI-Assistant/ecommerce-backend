import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DiscountStatus } from '@prisma/client';
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

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleDiscountStatusUpdate() {
    const now = new Date();
    await Promise.all([
      this.dbContext.discount.updateMany({
        where: {
          startTime: {
            lte: now,
          },
          endTime: {
            gte: now,
          },
          status: { not: DiscountStatus.ACTIVE },
        },
        data: {
          status: DiscountStatus.ACTIVE,
        },
      }),

      this.dbContext.discount.updateMany({
        where: {
          endTime: {
            lt: now,
          },
          status: { not: DiscountStatus.EXPIRED },
        },
        data: {
          status: DiscountStatus.EXPIRED,
        },
      }),
    ]);
  }
}
