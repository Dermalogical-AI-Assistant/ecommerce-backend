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
  }
}> 

export class GetAllOrdersQueryResponse extends PaginatedOutputDto<OrderDto> {
  @ApiProperty({
    description: 'List of all orders',
    isArray: true,
  })
  data: OrderDto[];
}
