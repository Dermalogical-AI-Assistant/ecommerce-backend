import { ApiProperty } from '@nestjs/swagger';
import { ImportLogEntity } from './import-log.entity';
import { ImportSocketClientEntity } from './import-socket-client.entity';

export class ImportFileEntity {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  name: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  totalRecords: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  logs?: ImportLogEntity[];
  @ApiProperty({
    isArray: true,
    required: false,
  })
  socketClients?: ImportSocketClientEntity[];
}
