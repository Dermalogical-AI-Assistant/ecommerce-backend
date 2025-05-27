import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsGateway } from './events.gateway';
import { DatabaseModule } from 'src/database';
import { GetImportLogsHandler } from './queries';

const commandHandlers = [];
const queryHandlers = [GetImportLogsHandler];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule
  ],
  providers: [
    EventsGateway,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class EventsModule {}