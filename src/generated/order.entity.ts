import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { OrderItemEntity } from './order-item.entity';

export class OrderEntity {
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
  shippingAddressId: string;
  @ApiProperty({
    enum: OrderStatus,
    required: false,
  })
  status: OrderStatus;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  totalAmount: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  totalDiscount: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  shippingFee: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  finalAmount: number;
  @ApiProperty({
    enum: PaymentMethod,
    required: false,
  })
  paymentMethod: PaymentMethod;
  @ApiProperty({
    enum: PaymentStatus,
    required: false,
  })
  paymentStatus: PaymentStatus;
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
  shippingAddress?: ShippingAddressEntity;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  orderItems?: OrderItemEntity[];
}
