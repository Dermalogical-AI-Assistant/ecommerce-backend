import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export type CartItemProduct = Prisma.CartItemGetPayload<{
  select: {
    product: true,
    quantity: true, 
    createdAt: true,
  }
}> 

export class GetMyCartItemsQueryResponse extends PaginatedOutputDto<CartItemProduct> {
  @ApiProperty({
    description: 'List of products in my cart',
    isArray: true,
  })
  data: CartItemProduct[];
}
