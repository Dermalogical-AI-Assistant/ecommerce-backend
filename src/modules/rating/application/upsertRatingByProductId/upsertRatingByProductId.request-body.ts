import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class UpsertRatingByProductIdRequestBody {
  @ApiProperty({
    description: 'Id of product',
    example: '0d24551e-57f0-4702-bdd6-535d010df643',
  })
  @IsUUID()
  productId: string;
  
  @ApiProperty({
    description: `Rating 0-5`,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
