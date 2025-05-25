import { forwardRef, Module, Global } from '@nestjs/common';
import { RabbitMqService } from './services/rabbitmq.service';
import { RabbitMqConsumer } from './services/rabbitmq.consumer';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database';
import { ProductModule } from '../product';

@Global()
@Module({
  imports: [
      DatabaseModule,
      ConfigModule.forRoot(),
      forwardRef(() => ProductModule),
    ],
  providers: [RabbitMqService, RabbitMqConsumer],
  exports: [RabbitMqService],
})
export class RabbitMqModule { }
