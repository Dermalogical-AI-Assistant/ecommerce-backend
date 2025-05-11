import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';
import { GetRatingsOrderByEnum } from '../../rating.enum';

export class GetRatingsByProductIdRequestQuery {
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
      GetRatingsOrderByEnum,
    )}`,
    example: `${GetRatingsOrderByEnum.RATING}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetRatingsOrderByEnum)
  order?: string;
}
