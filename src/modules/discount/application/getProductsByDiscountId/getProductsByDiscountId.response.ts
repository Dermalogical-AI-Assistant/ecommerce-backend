import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { ProductDto } from 'src/generated';

export class GetProductsByDiscountIdQueryResponse extends PaginatedOutputDto<
  Partial<ProductDto>
> {
  @ApiProperty({
    description: 'List of products by discount id',
    isArray: true,
  })
  data: Partial<ProductDto>[];
}
