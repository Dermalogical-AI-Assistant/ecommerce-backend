import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountStatus, DiscountType } from '@prisma/client';
import _ from 'lodash';
import { PrismaService } from 'src/database';
import { ProductDto } from 'src/generated';

@Injectable()
export class OrderService {
  constructor(private readonly dbContext: PrismaService) {}

  public async validateOrderExistsById(id: string) {
    const order = await this.dbContext.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }
    return order;
  }

  public async validateOrderItemExistsById(id: string) {
    const orderItem = await this.dbContext.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found!');
    }
    return orderItem;
  }

  public async getValidDiscountsForProduct(
    product: ProductDto,
    quantity: number,
  ) {
    const price = product.price * quantity;

    const discounts = await this.dbContext.discount.findMany({
      where: {
        status: DiscountStatus.ACTIVE,
        OR: [
          {
            skincareConcerns: {
              isEmpty: true,
            },
          },
          {
            skincareConcerns: {
              hasSome: product.skincareConcerns,
            },
          },
        ],
        publishDate: {
          lte: product.createdAt,
        },
        currency: product.currency,
        minPrice: {
          lte: price,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        discountType: true,
        discountValue: true,
        skincareConcerns: true,
        publishDate: true,
        minPrice: true,
        currency: true,
      },
    });

    const fixedAmountDiscounts = discounts
      .filter((d) => d.discountType == DiscountType.FIXED_AMOUNT)
      .reduce((total, currentValue) => {
        return total + currentValue.discountValue;
      }, 0);

    const percentDiscounts = discounts
      .filter((d) => d.discountType == DiscountType.PERCENT)
      .reduce((total, currentValue) => {
        return total + (1 - currentValue.discountValue / 100) * price;
      }, 0);

    return {
      discounts,
      discountAmount: fixedAmountDiscounts + percentDiscounts,
    };
  }
}
