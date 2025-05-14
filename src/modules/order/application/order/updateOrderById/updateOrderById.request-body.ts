import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod, PaymentStatus, SkincareConcern } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class UpdateOrderByIdRequestBody {
  @ApiPropertyOptional({
    description: 'Shipping Address Id',
    example: '0d24551e-57f0-4702-bdd6-535d010df643',
  })
  @IsOptional()
  @IsUUID('all')
  shippingAddressId?: string;

  @ApiPropertyOptional({
    description: 'Status',
    example: OrderStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Shipping Fee',
    example: 100,
  })
  @IsOptional()
  @IsPositive()
  shippingFee?: number;

  @ApiPropertyOptional({
    description: 'Payment Method',
    example: PaymentMethod.COD,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Payment Status',
    example: PaymentStatus.PAID,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
