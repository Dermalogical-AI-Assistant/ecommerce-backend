import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertRatingByProductIdRequestBody } from './upsertRatingByProductId.request-body';
import { UpsertRatingByProductIdCommand } from './upsertRatingByProductId.command';
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
export class UpsertRatingByProductIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upsert a rating' })
  @Post(':productId')
  public update(@Body() body: UpsertRatingByProductIdRequestBody, @RequestUser() user: LoginUserDto): Promise<void> {
    return this.commandBus.execute<UpsertRatingByProductIdCommand, void>(new UpsertRatingByProductIdCommand(user.id, body));
  }
}
