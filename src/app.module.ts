import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { ProductModule } from './modules/product';

@Module({
  imports: [
    // KafkaModule,
    ProductModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
