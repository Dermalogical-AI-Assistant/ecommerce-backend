import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  content: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  images: string[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
