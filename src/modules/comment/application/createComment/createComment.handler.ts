import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './createComment.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateCommentCommand): Promise<void> {
    const { userCommentParent } = await this.validate(command);

    await this.createComment(command);
  }

  private async createComment(command: CreateCommentCommand): Promise<void> {
    const {
      userId,
      body: { productId, parentId, content, images },
    } = command;

    await this.dbContext.comment.create({
      data: {
        userId,
        productId,
        parentId,
        content,
        images,
      },
    });
  }

  private async validate(command: CreateCommentCommand) {
    const {
      userId,
      body: { productId, parentId },
    } = command;

    const [existedProduct, commentParent] = await Promise.all([
      this.dbContext.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
        },
      }),

      parentId
        ? this.dbContext.comment.findUnique({
            where: {
              id: parentId,
            },
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  avatar: true,
                  name: true,
                },
              },
            },
          })
        : undefined,
    ]);

    if (!existedProduct?.id) {
      throw new NotFoundException('The product does not exist');
    }

    if (parentId && !commentParent?.id) {
      throw new NotFoundException('The comment parent do not exist in system');
    }

    return { userCommentParent: commentParent?.user };
  }
}
