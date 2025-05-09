import { Body, Controller, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateCommentByIdCommand } from './updateCommentById.command';
import { UpdateCommentByIdRequestBody } from './updateCommentById.request-body';
import { UpdateCommentByIdRequestParam } from './updateCommentById.request-param';
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
export class UpdateCommentByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update comment by id' })
  @Put(':id')
  public update(
    @Param() { id }: UpdateCommentByIdRequestParam, 
    @Body() body: UpdateCommentByIdRequestBody,
    @RequestUser() user: LoginUserDto
  ): Promise<void> {
    return this.commandBus.execute<UpdateCommentByIdCommand, void>(new UpdateCommentByIdCommand(id, user.id, body));
  }
}
