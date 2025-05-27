import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database';

@Injectable()
export class ImportLogService {
  constructor(
    private readonly dbContext: PrismaService,
  ) { }

  public async writeLog(option: {
    importFileId: string,
    index?: number,
    contentLog: string
  }) {
    const { importFileId, index, contentLog } = option;
    await this.dbContext.importLog.create({
      data: {
        fileId: importFileId,
        content: index? `Product at index ${index} - ${contentLog}`: `${contentLog}`,
      },
    });
  }
}
