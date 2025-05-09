import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentByIdCommand } from './updateCommentById.command';
import { UpdateCommentByIdRequestBody } from './updateCommentById.request-body';
import { PrismaService } from 'src/database';
import { getDateNow } from 'src/common/utils/date';

@CommandHandler(UpdateCommentByIdCommand)
export class UpdateProductByIdHandler
  implements ICommandHandler<UpdateCommentByIdCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateCommentByIdCommand) {
    await this.validate(command);

    await this.updateProductById(command);
  }

  private async updateProductById(command: UpdateCommentByIdCommand) {
    const {
      id,
      body: { productId, parentId, content, images },
    } = command;

    await this.dbContext.comment.update({
      where: {
        id,
      },
      data: {
        content,
        productId,
        parentId,
        images,
        createdAt: getDateNow(),
      },
    });
  }

  private async validate(command: UpdateCommentByIdCommand) {
    const {
      id,
      userId,
      body: { productId, parentId },
    } = command;

    const commentArr = [...new Set([id, parentId])].filter((s) => s);

    if (parentId && commentArr.length !== 2) {
      throw new BadRequestException(
        'Comment and parent comment are duplicated',
      );
    }

    const [existedComments, existedProduct] = await Promise.all([
      this.dbContext.comment.findMany({
        where: {
          id: {
            in: commentArr,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      }),
      productId
        ? this.dbContext.product.findUnique({
            where: {
              id: productId,
            },
            select: {
              id: true,
            },
          })
        : undefined,
    ]);

    if (existedComments.length !== commentArr.length) {
      throw new NotFoundException('Comments do not exist');
    }

    if (productId && !existedProduct?.id) {
      throw new NotFoundException('The product do not exist');
    }

    const comment = existedComments.find((c) => c.id === id)!;

    if (comment.userId !== userId) {
      throw new BadRequestException(
        `You dont have permission to update other's comment`,
      );
    }
  }
}
