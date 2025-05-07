import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { ProductDto } from 'src/generated';

export class GetNewsQueryResponse extends PaginatedOutputDto<ProductDto> {
  @ApiProperty({
    description: 'List of products',
    isArray: true,
  })
  data: ProductDto[];
}
