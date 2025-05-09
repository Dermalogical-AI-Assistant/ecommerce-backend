import { Controller, Delete, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteCommentByIdRequestParam } from './deleteCommentById.request-param';
import { DeleteCommentByIdCommand } from './deleteCommentById.command';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Comment')
@Controller({
  path: 'comments',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class DeleteCommentByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete comment by id' })
  @Delete(':id')
  public delete(@Param() { id }: DeleteCommentByIdRequestParam, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<DeleteCommentByIdCommand, void>(new DeleteCommentByIdCommand(id, user.id));
  }
}
