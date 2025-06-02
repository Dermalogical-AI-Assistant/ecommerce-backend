import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImportSocketClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientId: string;
}
