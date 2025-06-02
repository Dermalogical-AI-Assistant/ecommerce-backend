import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetImportLogsQuery } from './getImportLogs.query';
import { PrismaService } from 'src/database';
import { ImportLogDto } from 'src/generated';

@QueryHandler(GetImportLogsQuery)
export class GetImportLogsHandler implements IQueryHandler<GetImportLogsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  async execute({ importFileId }: GetImportLogsQuery): Promise<ImportLogDto[]> {
    const logs = await this.dbContext.importLog.findMany({ where: { fileId: importFileId} });
    return logs; 
  }
}