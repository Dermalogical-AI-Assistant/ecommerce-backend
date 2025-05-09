import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export class CommentProduct {
  id: string;
  content: string;
  images: string[];
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  parentId?: string;
  parent?: CommentProduct;
  children?: CommentProduct[];
}

export class GetCommentsByProductIdQueryResponse extends PaginatedOutputDto<CommentProduct> {
  @ApiProperty({
    description: 'List of comments by product id',
    isArray: true,
  })
  data: CommentProduct[];
}
