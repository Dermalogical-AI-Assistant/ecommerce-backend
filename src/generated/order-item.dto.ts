import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  originalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  finalPrice: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  discountAmount: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  note: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
