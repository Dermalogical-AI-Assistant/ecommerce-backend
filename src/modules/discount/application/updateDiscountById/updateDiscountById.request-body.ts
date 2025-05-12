import { ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyType, DiscountType, SkincareConcern } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateDiscountByIdRequestBody {
  @ApiPropertyOptional({
    description: 'Title',
    example: 'ABC',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'ABC',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: `Discount Type Values: ${Object.values(DiscountType)}`,
    example: DiscountType.PERCENT,
  })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({
    description: 'Amount',
    example: 4.9,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({
    description: 'Start time',
    example: '2025-05-03',
  })
  @IsOptional()
  @IsISO8601()
  startTime?: Date;

  @ApiPropertyOptional({
    description: 'End time',
    example: '2025-05-03',
  })
  @IsOptional()
  @IsISO8601()
  endTime?: Date;

  @ApiPropertyOptional({
    description: 'Skin concerns of satisfied products',
    type: Array,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SkincareConcern, { each: true })
  skincareConcerns?: SkincareConcern[];

  @ApiPropertyOptional({
    description: 'Min price of satisfied products',
    example: 4.9,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Currency of price',
    example: CurrencyType.DOLLAR,
  })
  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;

  @ApiPropertyOptional({
    description: 'Min publish date of satisfied products',
    example: '2025-05-03',
  })
  @IsOptional()
  @IsISO8601()
  publishDate?: Date;
}
