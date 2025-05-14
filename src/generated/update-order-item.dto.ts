import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  originalPrice?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  finalPrice?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  note?: string | null;
}
