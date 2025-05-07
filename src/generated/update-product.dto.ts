import { CurrencyType, SkincareConcern } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
  @ApiProperty({
    enum: CurrencyType,
    required: false,
  })
  @IsOptional()
  currency?: CurrencyType;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  howToUse?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ingredientBenefits?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  fullIngredientsList?: string | null;
  @ApiProperty({
    isArray: true,
    enum: SkincareConcern,
    required: false,
  })
  @IsOptional()
  @IsArray()
  skincareConcerns?: SkincareConcern[];
}
