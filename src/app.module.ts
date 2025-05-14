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
import { UserModule } from './modules/users/user.module';
import { KafkaConsumerService } from './modules/kafka/services';
import { UserService } from './modules/users/services';
import { UserTopic } from './common/topic/user.topic';

@Module({
  imports: [
    KafkaModule,
    ProductModule,
    CommentModule,
    WishlistModule,
    CartItemModule, 
    RatingModule,
    ShippingAddressModule,
    DiscountModule,
    OrderModule,
    UserModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    this.kafkaConsumerService.registerHandler(UserTopic.CREATE_USER, async (message) => {
      await this.userService.createUser(message);
    });

    this.kafkaConsumerService.registerHandler(UserTopic.UPDATE_USER, async (message) => {
      await this.userService.updateUser(message);
    });

    this.kafkaConsumerService.registerHandler(UserTopic.DELETE_USER, async (message) => {
      await this.userService.deleteUserById(message);
    });
  }
}
