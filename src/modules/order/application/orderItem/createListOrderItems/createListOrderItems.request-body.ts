import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class OrderItemRequest {
  @ApiProperty({
    description: 'Product ID',
    example: '0d24551e-57f0-4702-bdd6-535d010df643',
  })
  @IsUUID('all')
  productId: string;

  @ApiPropertyOptional({
    description: 'Title',
    example: 'ABC',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateListOrderItemsRequestBody {
  @ApiProperty({
    description: 'List of order items',
    type: [OrderItemRequest],
    // example: [{
    //   productId: "0d24551e-57f0-4702-bdd6-535d010df643",
    //   note: "ABC"
    // }]
  })
  @IsArray()
   @ValidateNested({ each: true })
  @Type(() => OrderItemRequest)
  @Transform(({ value }) => {
    const orderItems = Array.isArray(value) ? value : [value];
    if (orderItems?.length > 50) {
      throw new BadRequestException('No more than 50 items in an order!');
    } 
    return orderItems;
  })
  orderItems: OrderItemRequest[];
}
