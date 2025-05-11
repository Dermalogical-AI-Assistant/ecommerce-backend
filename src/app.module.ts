import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { ProductModule } from './modules/product';
import { CommentModule } from './modules/comment';

@Module({
  imports: [
    // KafkaModule,
    ProductModule,
    CommentModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
