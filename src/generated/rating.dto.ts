import { ApiProperty } from '@nestjs/swagger';

export class RatingDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  rating: number;
}
