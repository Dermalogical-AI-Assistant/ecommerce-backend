import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrencyType, SkincareConcern } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateProductByIdRequestBody {
  @ApiProperty({
    description: 'Thumbnail',
    maxLength: 255,
    example: 'Sway',
  })
  @IsUrl()
  @MaxLength(255, { message: 'Thumbnail cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  thumbnail: string;

  @ApiPropertyOptional({
    description: 'Additional Images',
    type: Array
  })
  @IsOptional()
  @IsArray()
  @IsUrl(undefined, { each: true })
  @Type(() => String)
  additionalImages?: string[];

  @ApiProperty({
    description: 'Title',
    maxLength: 255,
    example: 'Sway',
  })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @ApiProperty({
    description: 'Price',
    example: 3.8,
  })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Currency of price',
    example: CurrencyType.DOLLAR,
  })
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @ApiPropertyOptional({
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @ApiPropertyOptional({
    description: 'How to use',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  howToUse?: string;

  @ApiPropertyOptional({
    description: 'Ingredient Benefits',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ingredientBenefits?: string;

  @ApiPropertyOptional({
    description: 'List of Ingredients of Product',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullIngredientsList?: string;

  @ApiPropertyOptional({
    description: 'Skin concerns',
    type: Array
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SkincareConcern, { each: true })
  skincareConcerns?: SkincareConcern[];
}
