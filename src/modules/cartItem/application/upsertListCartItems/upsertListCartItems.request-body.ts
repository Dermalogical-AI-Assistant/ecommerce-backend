import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CartItemRequest {
  @ApiProperty({
    description: 'Product ID',
    example: '0d24551e-57f0-4702-bdd6-535d010df643',
  })
  @IsUUID('all')
  productId: string;

  @ApiProperty({
    description: 'Quantity',
    example: 1,
  })
  @IsPositive()
  quantity: number;
}

export class UpsertListCartItemsRequestBody {
  @ApiProperty({
    description: 'List of order items',
    type: [CartItemRequest],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemRequest)
  @Transform(({ value }) => {
    const orderItems = Array.isArray(value) ? value : [value];
    return orderItems;
  })
  cartItems: CartItemRequest[];
}
