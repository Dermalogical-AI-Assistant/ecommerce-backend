import { ApiProperty } from '@nestjs/swagger';
import { ImportLogEntity } from './import-log.entity';

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
}
