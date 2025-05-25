import { GetLogsByImportFileIdRequestQuery } from './getLogsByImportFileId.request-query';

export class GetLogsByImportFileIdQuery {
  constructor(public readonly importFileId: string, public readonly query: GetLogsByImportFileIdRequestQuery) {}
}
