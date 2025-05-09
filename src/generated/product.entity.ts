import { CurrencyType, SkincareConcern } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { WishlistEntity } from './wishlist.entity';
import { CartItemEntity } from './cart-item.entity';
import { OrderItemEntity } from './order-item.entity';
import { RatingEntity } from './rating.entity';
import { CommentEntity } from './comment.entity';

export class ProductEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  thumbnail: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  additionalImages: string[];
  @ApiProperty({
    required: false,
  })
  title: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  price: number;
  @ApiProperty({
    enum: CurrencyType,
    required: false,
  })
  currency: CurrencyType;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  averageRating: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  howToUse: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  ingredientBenefits: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  fullIngredientsList: string | null;
  @ApiProperty({
    isArray: true,
    enum: SkincareConcern,
    required: false,
  })
  skincareConcerns: SkincareConcern[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  wishlists?: WishlistEntity[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  cartItems?: CartItemEntity[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  orderItems?: OrderItemEntity[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  ratings?: RatingEntity[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  comments?: CommentEntity[];
}
