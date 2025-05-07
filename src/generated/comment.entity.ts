import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

export class CommentEntity {
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
  productId: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  parentId: string | null;
  @ApiProperty({
    required: false,
  })
  content: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  images: string[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  product?: ProductEntity;
  @ApiProperty({
    required: false,
  })
  user?: UserEntity;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  parent?: CommentEntity | null;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  children?: CommentEntity[];
}
