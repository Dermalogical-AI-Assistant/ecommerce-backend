import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({
    required: false,
  })
  id: string;
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
}
