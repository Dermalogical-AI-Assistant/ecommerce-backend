import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, RoleType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';
import { GetShippingAddressesOrderByEnum } from '../../shippingAddress.enum';

export class GetMyShippingAddressesRequestQuery {
  @ApiPropertyOptional({
    description: 'Search by phone or address or district or city or country',
    example: 'Da Nang',
  })
  @IsOptional()
  @IsString()
  search?: string | null;

  @ApiPropertyOptional({
    description: 'Number of records to skip and then return the remainder',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => value - 1)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 1;

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
      GetShippingAddressesOrderByEnum,
    )}`,
    example: `${GetShippingAddressesOrderByEnum.CREATED_AT}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetShippingAddressesOrderByEnum)
  order?: string;
}
