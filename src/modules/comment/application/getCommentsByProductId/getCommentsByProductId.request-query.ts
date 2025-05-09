import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';
import { GetCommentsOrderByEnum } from '../../comment.enum';

export class GetCommentsByProductIdRequestQuery {
  @ApiPropertyOptional({
    description: 'Number of records to skip and then return the remainder',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of records to return and then skip over the remainder',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: `Order by keyword. \n\n  Available values: ${Object.values(
      GetCommentsOrderByEnum,
    )}`,
    example: `${GetCommentsOrderByEnum.CREATED_AT}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetCommentsOrderByEnum)
  order?: string;
}
