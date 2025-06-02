import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetImportLogsQuery } from './queries/getImportLogs/getImportLogs.query';
import { WebsocketRolesGuard } from 'src/common/guard/websocketRoles.guard';
import { RoleType } from '@prisma/client';
import { Role } from 'src/common/role/role.decorator';
import { WebsocketUser } from 'src/common/decorator/websocketUser.decorator';
import { WebsocketMiddleware } from './events.middleware';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { WebSocketService } from './services';
import { ImportEventEnum } from 'src/common/enum/event.enum';
import { CreateImportSocketClientCommand } from './commands/createImportSocketClient/createImportSocketClient.command';
import { CreateImportSocketClientMessageBody } from './commands/createImportSocketClient/createImportSocketClient.message-body';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly websocketMiddleware: WebsocketMiddleware,
    private readonly websocketService: WebSocketService
  ) { }

  afterInit(server: Server) {
    this.server = server;
    this.websocketService.setServer(server);
    this.server.use((socket, next) => this.websocketMiddleware.use(socket, next));
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(ImportEventEnum.CONNECT_SOCKET_CLIENT)
  @UseGuards(WebsocketRolesGuard)
  @Role(RoleType.ADMIN)
  async handleGetEvents(@MessageBody() data: any,
    @ConnectedSocket() connectedSocket: Socket,
    @WebsocketUser() user: LoginUserDto
  ): Promise<void> {
    this.logger.log(`Received ${ImportEventEnum.CONNECT_SOCKET_CLIENT} request!`);

    try {
      this.logger.log(`Connected Socket ID: ${connectedSocket.id}`);

      if (data?.importFileId) {
        const body = {
          clientId: connectedSocket.id,
          importFileId: data.importFileId
        }
        await this.commandBus.execute(new CreateImportSocketClientCommand(body));
        connectedSocket.emit(ImportEventEnum.DONE_CONNECT, 'Connect WebSocket client successfully!');
      }
    } catch (error) {
      this.logger.error(`Error getting events: ${error}`);
      connectedSocket.emit('eventsFetchFailed', {
        message: 'Failed to fetch events',
        error: error.message,
      });
    }
  }
}