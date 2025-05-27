import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetImportLogsQuery } from './queries/getImportLogs/getImportLogs.query';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getImportLogs')
  async handleGetEvents(@MessageBody() data: any): Promise<void> {
    this.logger.log(`Received getImportLogss request!`);
    try {
      const query = new GetImportLogsQuery(data.importFileId);
      const logs = await this.queryBus.execute(query);
      this.server.emit('logs', logs);
    } catch (error) {
      this.logger.error(`Error getting events: ${error}`);
      this.server.emit('eventsFetchFailed', {
        message: 'Failed to fetch events',
        error: error.message,
      });
    }
  }
}