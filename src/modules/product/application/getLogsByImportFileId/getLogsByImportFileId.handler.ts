import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetLogsByImportFileIdQueryResponse } from './getLogsByImportFileId.response';
import { GetLogsByImportFileIdQuery } from './getLogsByImportFileId.query';

@QueryHandler(GetLogsByImportFileIdQuery)
export class GetLogsByImportFileIdHandler implements IQueryHandler<GetLogsByImportFileIdQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute({
    query, importFileId
  }: GetLogsByImportFileIdQuery): Promise<GetLogsByImportFileIdQueryResponse> {
    const { perPage, page } = query;

    const { total, logs } = await this.getLogs({ importFileId, query });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: logs,
    };

    return response as GetLogsByImportFileIdQueryResponse;
  }

  private async getLogs({
    importFileId,
    query: { page, perPage },
  }: GetLogsByImportFileIdQuery) {

    const whereCondition: Prisma.ImportLogWhereInput = { fileId: importFileId };

    const [total, logs] = await Promise.all([
      this.dbContext.importLog.count({
        where: whereCondition
      }),
      this.dbContext.importLog.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: Prisma.SortOrder.asc
        },
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, logs };
  }
}
