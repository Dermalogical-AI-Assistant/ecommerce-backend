import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  originalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  finalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  discountAmount: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
