import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { ProductDto } from 'src/generated';

export type WishlistProduct = Prisma.WishlistGetPayload<{
  select: {
    product: true,
    createdAt: true
  }
}> 

export class GetMyWishlistQueryResponse extends PaginatedOutputDto<WishlistProduct> {
  @ApiProperty({
    description: 'List of products in my wishlist',
    isArray: true,
  })
  data: WishlistProduct[];
}
