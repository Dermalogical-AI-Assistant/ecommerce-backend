import { CurrencyType, SkincareConcern } from '@prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  thumbnail: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @ApiProperty({
    enum: CurrencyType,
  })
  @IsNotEmpty()
  currency: CurrencyType;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  howToUse?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ingredientBenefits?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  fullIngredientsList?: string;
  @ApiProperty({
    isArray: true,
    enum: SkincareConcern,
  })
  @IsNotEmpty()
  @IsArray()
  skincareConcerns: SkincareConcern[];
}
