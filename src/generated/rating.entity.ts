import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

export class RatingEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
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
  rating: number;
  @ApiProperty({
    required: false,
  })
  user?: UserEntity;
  @ApiProperty({
    required: false,
  })
  product?: ProductEntity;
}
