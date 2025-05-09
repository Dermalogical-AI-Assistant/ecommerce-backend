import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { DeleteCommentByIdCommand } from './deleteCommentById.command';
import { RoleType } from '@prisma/client';

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdHandler implements ICommandHandler<DeleteCommentByIdCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({ id,userId }: DeleteCommentByIdCommand): Promise<void> {
    await this.validate( id, userId );

    await this.dbContext.comment.delete({ where: { id } });
  }

  private async validate(id: string, userId: string) {
    const [comment, user] = await Promise.all([
      this.dbContext.comment.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userId: true,
        }
      }),
      
      this.dbContext.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          role: true
        }
      })
    ])


    if (!comment?.id) {
      throw new NotFoundException('The comment does not exist.');
    }

    if (!user?.id) {
      throw new NotFoundException('The user does not exist.');
    }

    if (comment.userId !== userId && user.role === RoleType.ADMIN) {
      throw new ForbiddenException(`You dont have permission to delete other's comment`)
    }
  }
}
