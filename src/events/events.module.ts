import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsGateway } from './events.gateway';
import { DatabaseModule } from 'src/database';
import { GetImportLogsHandler } from './queries';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketMiddleware } from './events.middleware';
import * as services from './services';
import { CreateImportSocketClientHandler } from './commands';

const Services = [...Object.values(services)];

const commandHandlers = [CreateImportSocketClientHandler];
const queryHandlers = [GetImportLogsHandler];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    JwtModule.register({ signOptions: { algorithm: 'HS256' } }),
  ],
  providers: [
    EventsGateway,
    WebsocketMiddleware,
    ...commandHandlers,
    ...queryHandlers,
    ...Services
  ],
  exports: [...Services]
})
export class EventsModule { }
