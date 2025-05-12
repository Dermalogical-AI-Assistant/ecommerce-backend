import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DiscountStatus,
  DiscountType,
  Prisma,
  SkincareConcern,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';
import { GetDiscountsOrderByEnum } from '../../discount.enum';

export class GetDiscountsRequestQuery {
  @ApiPropertyOptional({
    description: `Discount Status values: ${Object.values(DiscountStatus)}`,
    type: Array,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DiscountStatus, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  statuses?: DiscountStatus[];

  @ApiPropertyOptional({
    description: `Skincare Concern values: ${Object.values(SkincareConcern)}`,
    type: Array,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SkincareConcern, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  skincareConcerns?: SkincareConcern[];

  @ApiPropertyOptional({
    description: `Discount Type Values: ${Object.values(DiscountType)}`,
    example: DiscountType.PERCENT,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DiscountType, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  discountTypes?: DiscountType[];

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
      GetDiscountsOrderByEnum,
    )}`,
    example: `${GetDiscountsOrderByEnum.START_TIME}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetDiscountsOrderByEnum)
  order?: string;
}
