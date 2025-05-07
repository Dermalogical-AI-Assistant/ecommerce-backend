import { PaymentMethod } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalDiscount?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  finalAmount?: number;
  @ApiProperty({
    enum: PaymentMethod,
    required: false,
  })
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
