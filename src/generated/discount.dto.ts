import { DiscountType, DiscountStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DiscountDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  title: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    enum: DiscountType,
    required: false,
  })
  discountType: DiscountType;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  discountValue: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  startTime: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  endTime: Date;
  @ApiProperty({
    enum: DiscountStatus,
    required: false,
  })
  status: DiscountStatus;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
