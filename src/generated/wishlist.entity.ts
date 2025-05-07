import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

export class WishlistEntity {
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  productId: string;
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
