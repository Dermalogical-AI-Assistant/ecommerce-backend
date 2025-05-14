import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { ProductModule } from './modules/product';
import { CommentModule } from './modules/comment';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CartItemModule } from './modules/cartItem/cartItem.module';
import { RatingModule } from './modules/rating/rating.module';
import { ShippingAddressModule } from './modules/shippingAddress';
import { DiscountModule } from './modules/discount';
import { OrderModule } from './modules/order';

@Module({
  imports: [
    // KafkaModule,
    ProductModule,
    CommentModule,
    WishlistModule,
    CartItemModule, 
    RatingModule,
    ShippingAddressModule,
    DiscountModule,
    OrderModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
