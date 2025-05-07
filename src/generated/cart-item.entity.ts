import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

export class CartItemEntity {
  @ApiProperty({
    required: false,
  })
  productId: string;
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  quantity: number;
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
    required: false,
  })
  product?: ProductEntity;
}
