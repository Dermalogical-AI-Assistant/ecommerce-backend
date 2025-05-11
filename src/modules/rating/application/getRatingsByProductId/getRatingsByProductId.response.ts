import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export class ProductRatingDto {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
}

export class GetRatingsByProductIdQueryResponse extends PaginatedOutputDto<ProductRatingDto> {
  @ApiProperty({
    description: 'List of ratings by product id',
    isArray: true,
  })
  data: ProductRatingDto[];
}
