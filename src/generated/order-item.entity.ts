import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';
import { DiscountProductEntity } from './discount-product.entity';

export class OrderItemEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  orderId: string;
  @ApiProperty({
    required: false,
  })
  productId: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  quantity: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  originalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  finalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  discountAmount: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  note: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  user?: UserEntity;
  @ApiProperty({
    required: false,
  })
  order?: OrderEntity;
  @ApiProperty({
    required: false,
  })
  product?: ProductEntity;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  discounts?: DiscountProductEntity[];
}
