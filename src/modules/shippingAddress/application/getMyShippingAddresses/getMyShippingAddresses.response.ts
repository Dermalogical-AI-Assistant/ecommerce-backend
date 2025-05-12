import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { ShippingAddressDto } from 'src/generated';

export class GetMyShippingAddressesQueryResponse extends PaginatedOutputDto<Partial<ShippingAddressDto>> {
  @ApiProperty({
    description: 'List of my shipping addresses',
    isArray: true,
  })
  data: Partial<ShippingAddressDto>[];
}
