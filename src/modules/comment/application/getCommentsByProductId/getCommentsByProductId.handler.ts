import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { GetCommentsByProductIdQuery } from './getCommentsByProductId.query';
import {
  CommentProduct,
  GetCommentsByProductIdQueryResponse,
} from './getCommentsByProductId.response';
import { CommentEntity } from 'src/generated/comment.entity';
import * as _ from 'lodash';
import { NotFoundException } from '@nestjs/common';
import { getOrderByDefault } from 'src/common/utils/order';

@QueryHandler(GetCommentsByProductIdQuery)
export class GetCommentsByProductIdHandler
  implements IQueryHandler<GetCommentsByProductIdQuery>
{
  constructor(private readonly dbContext: PrismaService) {}

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
      data: this.getOrganizedComments(comments),
    };

    return response as GetCommentsByProductIdQueryResponse;
  }

  private async getComments(
    options: GetCommentsByProductIdQuery,
  ): Promise<{ total: number; comments: CommentProduct[] }> {
    const {
      productId,
      query: { page, perPage, order },
    } = options;

    await this.validate(productId);

    let whereCondition: Prisma.CommentWhereInput = { productId };

    const [total, comments] = await Promise.all([
      this.dbContext.comment.count({
        where: {
          AND: whereCondition,
        },
      }),
      this.dbContext.comment.findMany({
        where: {
          AND: whereCondition,
        },
        include: {
          parent: {
            include: {
              user: true,
            },
          },
          children: {
            include: {
              user: true,
            },
          },
          user: true,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return {
      total,
      comments: comments.map((comment) => this.convertToCommentProduct(comment)),
    };
  }

  private convertToCommentProduct(comment: CommentEntity): CommentProduct {
    if (!comment) {
      return null;
    }

    return {
      id: comment.id,
      images: comment.images,
      content: comment.content,
      createdAt: comment.createdAt,
      parentId: comment.parentId,
      parent: this.convertToCommentProduct(comment.parent),
      user: {
        id: comment.user.id,
        name: comment.user.name,
        avatar: comment.user.avatar,
      },
      children: comment.children? comment.children.map((child) =>
        this.convertToCommentProduct(child),
      ): [],
    };
  }

  private async validate(productId: string) {
    const product = await this.dbContext.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException('This product is not found');
    }
  }

  private getOrganizedComments(comments: CommentProduct[]) {
    const filteredComments: CommentProduct[] = [];

    const lowestComments = comments.filter((c) => !c.children.length);

    for (const comment of lowestComments) {
      let tempComment = comment;
      let parentComment: CommentProduct;

      do {
        parentComment = this.getCommentParent(tempComment, comments);
        tempComment = parentComment;
      } while (tempComment?.parentId);

      filteredComments.push(parentComment);
    }

    return _.uniqBy(filteredComments, 'id');
  }

  private getCommentParent(
    comment: CommentProduct,
    allComments: CommentProduct[],
  ): CommentProduct {
    if (!comment.parentId) {
      return comment;
    }

    const parent = allComments.find((c) => c.id === comment.parentId);

    this.modifyComment(comment, parent);

    return parent;
  }

  private modifyComment(comment: CommentProduct, parent: CommentProduct) {
    const editChild = parent.children.find((c) => c.id === comment.id);

    editChild.children = comment.children;
  }
}
