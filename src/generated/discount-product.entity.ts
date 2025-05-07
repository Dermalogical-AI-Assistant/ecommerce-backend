import { ApiProperty } from '@nestjs/swagger';
import { OrderItemEntity } from './order-item.entity';
import { DiscountEntity } from './discount.entity';

export class DiscountProductEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  orderItemId: string;
  @ApiProperty({
    required: false,
  })
  discountId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  orderItem?: OrderItemEntity;
  @ApiProperty({
    required: false,
  })
  discount?: DiscountEntity;
}
