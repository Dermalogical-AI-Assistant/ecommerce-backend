import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateImportSocketClientDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  clientId?: string;
}
