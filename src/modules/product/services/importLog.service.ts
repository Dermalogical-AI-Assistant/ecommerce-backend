import { Injectable } from '@nestjs/common';
import { ImportLogStatus } from '@prisma/client';
import { ImportEventEnum } from 'src/common/enum/event.enum';
import { PrismaService } from 'src/database';
import { WebSocketService } from 'src/events/services';

@Injectable()
export class ImportLogService {
  constructor(
    private readonly dbContext: PrismaService,
    private readonly webSocketService: WebSocketService
  ) { }

  public async writeLog(option: {
    importFileId: string,
    index?: number,
    contentLog: string,
    status: ImportLogStatus
  }) {
    const { importFileId, index, contentLog, status } = option;
    const content = (typeof index === 'number') ? `Product at index ${index} - ${contentLog}` : `${contentLog}`;

    // Add to Import Log Table
    await this.dbContext.importLog.create({
      data: {
        fileId: importFileId,
        content,
        productIndex: index,
        status,
      },
    });

    // Emit Websocket to Clients
    const websocketClients = await this.dbContext.importSocketClient.findMany({
      where: {
        fileId: importFileId
      },
      select: {
        clientId: true
      }
    });

    for (const { clientId } of websocketClients) {
      this.webSocketService.emitToClient(clientId, ImportEventEnum.GET_LOGS, content);
    }
  }
}
