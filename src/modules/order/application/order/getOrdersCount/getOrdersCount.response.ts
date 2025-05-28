import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, Prisma } from '@prisma/client';

export class OrderCount {
  status: OrderStatus;
  count: number;
}
export class GetOrdersCountQueryResponse {
  @ApiProperty({
    description: 'List of orders count',
    isArray: true,
  })
  data: OrderCount[];
}
