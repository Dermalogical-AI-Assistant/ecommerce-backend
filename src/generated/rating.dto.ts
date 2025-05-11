import { ApiProperty } from '@nestjs/swagger';

export class RatingDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  rating: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
