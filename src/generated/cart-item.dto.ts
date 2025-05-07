import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  quantity: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
