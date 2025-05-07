import { ApiProperty } from '@nestjs/swagger';

export class ShippingAddressDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  phone: string;
  @ApiProperty({
    required: false,
  })
  address: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  district: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  city: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  country: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  postalCode: string | null;
  @ApiProperty({
    required: false,
  })
  isDefault: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
