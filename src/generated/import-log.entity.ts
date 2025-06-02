import { ImportLogStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ImportFileEntity } from './import-file.entity';

export class ImportLogEntity {
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
  content: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  productIndex: number;
  @ApiProperty({
    enum: ImportLogStatus,
    required: false,
  })
  status: ImportLogStatus;
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
