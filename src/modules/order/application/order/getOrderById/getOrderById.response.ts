import { Prisma } from "@prisma/client"

export type GetOrderByIdResponse = Prisma.OrderGetPayload<{
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
    orderItems: {
      select: {
        id: true,
        discountAmount: true,
        finalPrice: true,
        originalPrice: true,
        note: true,
        cartItem: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
                currency: true,
                skincareConcerns: true,
                averageRating: true,
              }
            }
          }
        }
      }
    }
  }
}> 
