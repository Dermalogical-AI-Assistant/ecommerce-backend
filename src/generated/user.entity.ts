import { Gender, RoleType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from './order.entity';
import { WishlistEntity } from './wishlist.entity';
import { CartItemEntity } from './cart-item.entity';
import { OrderItemEntity } from './order-item.entity';
import { ShippingAddressEntity } from './shipping-address.entity';
import { RatingEntity } from './rating.entity';
import { CommentEntity } from './comment.entity';

export class UserEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  name: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  avatar: string | null;
  @ApiProperty({
    required: false,
  })
  email: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  location: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  dob: Date | null;
  @ApiProperty({
    enum: Gender,
    required: false,
  })
  gender: Gender;
  @ApiProperty({
    enum: RoleType,
    required: false,
  })
  role: RoleType;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  orders?: OrderEntity[];
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
  addresses?: ShippingAddressEntity[];
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
