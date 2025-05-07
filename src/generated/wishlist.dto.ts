import { ApiProperty } from '@nestjs/swagger';

export class WishlistDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
