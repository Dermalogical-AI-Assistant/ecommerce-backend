import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingAddressDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  district?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  city?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  country?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  postalCode?: string | null;
}
