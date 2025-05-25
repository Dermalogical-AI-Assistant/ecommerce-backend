import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImportLogDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
