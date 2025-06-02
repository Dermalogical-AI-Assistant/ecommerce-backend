import { ApiProperty } from '@nestjs/swagger';
import { ImportFileEntity } from './import-file.entity';

export class ImportSocketClientEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  fileId: string;
  @ApiProperty({
    required: false,
  })
  clientId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  file?: ImportFileEntity;
}
