import { PaymentMethod } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  totalDiscount: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  finalAmount: number;
  @ApiProperty({
    enum: PaymentMethod,
  })
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
