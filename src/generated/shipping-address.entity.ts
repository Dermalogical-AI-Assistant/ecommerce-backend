import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

export class ShippingAddressEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  userId: string;
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
  @ApiProperty({
    required: false,
  })
  user?: UserEntity;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  orders?: OrderEntity[];
}
