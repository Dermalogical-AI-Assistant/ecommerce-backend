import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { ImportLogDto } from 'src/generated';

export class GetLogsByImportFileIdQueryResponse extends PaginatedOutputDto<ImportLogDto> {
  @ApiProperty({
    description: 'List of logss by import file id',
    isArray: true,
  })
  data: ImportLogDto[];
}
