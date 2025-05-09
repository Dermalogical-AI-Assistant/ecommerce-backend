import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, SkincareConcern } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';
import { GetProductOrderByEnum } from '../../product.enum';

export class GetProductsRequestQuery {
  @ApiPropertyOptional({
    description: 'Search by title or ingredients',
    example: 'Retinol',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Skin concerns',
    type: Array<SkincareConcern>,
    example: SkincareConcern.DRY_SKIN
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SkincareConcern, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  skincareConcerns?: SkincareConcern[];

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
    description: `Order by keyword. \n\n  Available values: ${Object.values(GetProductOrderByEnum)}`,
    example: `${GetProductOrderByEnum.TITLE}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetProductOrderByEnum)
  order?: string;
}
