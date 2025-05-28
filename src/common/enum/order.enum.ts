import { OrderStatus } from "@prisma/client";

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export const PROCESSED_ORDER_STATUSES = [OrderStatus.PENDING, OrderStatus.SHIPPING, OrderStatus.DELIVERED] as OrderStatus[];
