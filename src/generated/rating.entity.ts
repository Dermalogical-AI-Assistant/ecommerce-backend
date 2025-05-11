import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

export class RatingEntity {
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  productId: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  rating: number;
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
