import { CurrencyType, SkincareConcern } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    required: false,
  })
  thumbnail: string;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  additionalImages: string[];
  @ApiProperty({
    required: false,
  })
  title: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  price: number;
  @ApiProperty({
    enum: CurrencyType,
    required: false,
  })
  currency: CurrencyType;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  howToUse: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  ingredientBenefits: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  fullIngredientsList: string | null;
  @ApiProperty({
    isArray: true,
    enum: SkincareConcern,
    required: false,
  })
  skincareConcerns: SkincareConcern[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
}
