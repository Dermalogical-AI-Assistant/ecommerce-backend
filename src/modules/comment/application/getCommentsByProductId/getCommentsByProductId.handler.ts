import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetCommentsByProductIdQuery } from './getCommentsByProductId.query';
import {
  CommentProduct,
  GetCommentsByProductIdQueryResponse,
} from './getCommentsByProductId.response';
import { getOrderByDefault } from 'src/common/utils/order';
import { GetCommentsByProductIdDto } from '../../comment.dto';

@QueryHandler(GetCommentsByProductIdQuery)
export class GetCommentsByProductIdHandler
  implements IQueryHandler<GetCommentsByProductIdQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute({
    query,
    productId,
  }: GetCommentsByProductIdQuery): Promise<GetCommentsByProductIdQueryResponse> {
    const { perPage, page } = query;

    const { total, comments } = await this.getComments({ query, productId });

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: comments.map(c => this.mapComment(c)),
    };

    return response as GetCommentsByProductIdQueryResponse;
  }

  private async getComments({
    query: { parentId, perPage, page, order },
    productId,
  }: GetCommentsByProductIdQuery) {
    const whereCondition: Prisma.CommentWhereInput = {
      productId,
      parentId: parentId ?? null
    };

    const [total, comments] = await Promise.all([
      await this.dbContext.comment.count({
        where: whereCondition
      }),
      await this.dbContext.comment.findMany({
        where: whereCondition,
        select: {
          id: true,
          content: true,
          images: true,
          parentId: true,
          user: {
            select: {
              id: true,
              avatar: true,
              name :true
            }
          },
          createdAt: true,
          _count: {
            select: {
              children: true
            }
          }
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      })
    ]);

    return { total, comments };
  }

  private mapComment(comment: GetCommentsByProductIdDto): CommentProduct {
    return {
      id: comment.id,
      content: comment.content,
      images: comment.images,
      parentId: comment.parentId,
      numberOfChildren: comment._count.children,
      user: comment.user,
      createdAt: comment.createdAt
    }
  }
}
