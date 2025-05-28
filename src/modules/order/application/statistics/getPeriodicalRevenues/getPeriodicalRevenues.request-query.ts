import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {  GetPeriodicalRevenuesRequestType } from 'src/modules/order/order.enum';

export class GetPeriodicalRevenuesRequestQuery {
  @ApiProperty({
    description: 'Filter by request type',
    example: GetPeriodicalRevenuesRequestType.MONTHLY,
    enum: GetPeriodicalRevenuesRequestType,
  })
  @IsEnum(GetPeriodicalRevenuesRequestType)
  type: GetPeriodicalRevenuesRequestType;
}