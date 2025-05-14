import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export type OrderDto = Prisma.OrderGetPayload<{
  select: {
    id: true,
    shippingAddress: true,
    shippingFee: true,
    status: true,
    paymentMethod: true,
    paymentStatus: true,
    totalAmount: true,
    totalDiscount: true,
    finalAmount: true,
    createdAt: true,
    // orderItems: {
    //   select: {
    //     cartItem: {
    //       select: {
    //         quantity: true,
    //         product: {
    //           select: {
    //             id: true,
    //             title: true,
    //             thumbnail: true,
    //             price: true,
    //             currency: true,
    //             skincareConcerns: true,
    //             averageRating: true,
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
}> 

export class GetMyOrdersQueryResponse extends PaginatedOutputDto<OrderDto> {
  @ApiProperty({
    description: 'List of my orders',
    isArray: true,
  })
  data: OrderDto[];
}
