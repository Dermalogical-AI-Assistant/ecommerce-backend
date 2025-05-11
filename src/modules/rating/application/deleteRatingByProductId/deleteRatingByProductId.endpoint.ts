import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteRatingByProductIdRequestParam } from './deleteRatingByProductId.request-param';
import { DeleteRatingByProductIdCommand } from './deleteRatingByProductId.command';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Rating')
@ApiBearerAuth()
@Controller({
  path: 'ratings',
  version: '1',
})
@UseGuards(AuthenGuard)
export class DeleteRatingByProductIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete rating by product id' })
  @Delete(':productId')
  public delete(@Param() { productId }: DeleteRatingByProductIdRequestParam, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<DeleteRatingByProductIdCommand, void>(new DeleteRatingByProductIdCommand(productId, user.id));
  }
}
