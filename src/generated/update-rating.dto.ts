import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  rating?: number;
}
