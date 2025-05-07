import { DiscountType } from '@prisma/client';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiscountDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
  @ApiProperty({
    enum: DiscountType,
    required: false,
  })
  @IsOptional()
  discountType?: DiscountType;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountValue?: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startTime?: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endTime?: Date;
}
