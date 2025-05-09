import { Body, Controller, Post, UseGuards,  } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommentCommand } from './createComment.command';
import { CreateCommentRequestBody } from './createComment.request-body';
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
export class CreateCommentEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create an comment' })
  @Post()
  public create(@RequestUser() user: LoginUserDto, @Body() body: CreateCommentRequestBody): Promise<void> {
    return this.commandBus.execute<CreateCommentCommand, void>(new CreateCommentCommand(user.id, body));
  }
}
