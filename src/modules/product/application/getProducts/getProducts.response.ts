import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export class GetProductsResponse {
  id: string;
  thumbnail: string;
  additionalImages: string[];
  title: string;
  price: number;
  currency: $Enums.CurrencyType;
  averageRating: number;
  description: string;
  howToUse: string;
  ingredientBenefits: string;
  fullIngredientsList: string;
  skincareConcerns: $Enums.SkincareConcern[];
  totalQuantity: number;
  soldQuantity: number;
  createdAt: Date;
}

export class GetProductsQueryResponse extends PaginatedOutputDto<GetProductsResponse> {
  @ApiProperty({
    description: 'List of products',
    isArray: true,
  })
  data: GetProductsResponse[];
}
