import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, RoleType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

class shipping {
  phone: string;
  address: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export class CreateShippingAddressRequestBody {
  @ApiProperty({
    description: 'Phone',
    example: '0934853507',
  })
  @IsString()
  @MaxLength(15)
  phone: string;

  @ApiProperty({
    description: 'Address',
    example: '54 Nguyen Luong Bang',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'District',
    example: 'Thanh Khe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Da Nang',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Viet Nam',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
