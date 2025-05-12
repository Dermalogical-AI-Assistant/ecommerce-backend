import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { DiscountDto } from 'src/generated';

export class GetDiscountsQueryResponse extends PaginatedOutputDto<Partial<DiscountDto>> {
  @ApiProperty({
    description: 'List of discounts',
    isArray: true,
  })
  data: Partial<DiscountDto>[];
}
