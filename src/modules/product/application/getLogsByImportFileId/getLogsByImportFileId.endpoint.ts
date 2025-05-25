import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLogsByImportFileIdQuery } from './getLogsByImportFileId.query';
import { GetLogsByImportFileIdRequestQuery } from './getLogsByImportFileId.request-query';
import { GetLogsByImportFileIdQueryResponse } from './getLogsByImportFileId.response';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { GetLogsByImportFileIdRequestParam } from './getLogsByImportFileId.request-param';

@ApiTags('Product')
@Controller({
  path: 'import-logs',
  version: '1',
})
export class GetLogsByImportFileIdEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: 'Get all logs by import file id' })
  @Get(':importFileId')
  public get(@Param() { importFileId }: GetLogsByImportFileIdRequestParam, @Query() query: GetLogsByImportFileIdRequestQuery): Promise<PaginatedOutputDto<GetLogsByImportFileIdQueryResponse>> {
    return this.queryBus.execute<GetLogsByImportFileIdQuery, PaginatedOutputDto<GetLogsByImportFileIdQueryResponse>>(new GetLogsByImportFileIdQuery(importFileId, query));
  }
}
