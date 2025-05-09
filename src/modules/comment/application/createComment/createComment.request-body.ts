import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateCommentRequestBody {
  @ApiProperty({
    description: 'Id of product',
    example: '073bdc58-5a58-4293-a5c9-51a31643d1b8',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'Id of parent comment',
    example: '073bdc58-5a58-4293-a5c9-51a31643d1b8',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    description: 'Content',
    maxLength: 255,
    example: 'Brita',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Images',
    type: Array,
  })
  @IsOptional()
  @IsArray()
  @IsUrl(undefined, { each: true })
  @Type(() => String)
  images?: string[];
}
