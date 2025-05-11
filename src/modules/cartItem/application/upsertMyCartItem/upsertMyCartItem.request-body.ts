import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsUUID } from 'class-validator';

export class UpsertMyCartItemRequestBody {
  @ApiProperty({
    description: 'Id of product',
    example: '0d24551e-57f0-4702-bdd6-535d010df643',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of product',
    example: 3,
  })
  @IsPositive()
  quantity: number;
}
