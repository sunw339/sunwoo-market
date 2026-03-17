import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Currency, ProductStatus } from '@generated/prisma/enums';

class CreateProductInfoDto {
  @ApiProperty({ example: '블랙 M', description: '옵션명' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 29000, description: '가격' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'KRW', enum: Currency, description: '통화' })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({ example: 0, description: '할인율' })
  @IsOptional()
  @IsNumber()
  discountRate?: number;

  @ApiProperty({ example: 'ACTIVE', enum: ProductStatus, description: '상태' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ example: 100, description: '재고 수량' })
  @IsNumber()
  @Min(0)
  stockQty: number;
}

export class CreateProductDto {
  @ApiProperty({ example: '반팔 티셔츠', description: '상품명' })
  @IsString()
  name: string;

  @ApiProperty({ example: '편안한 반팔', description: '상품 설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://...', description: '이미지 URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'https://...', description: '썸네일 URL' })
  @IsOptional()
  @IsString()
  thumbUrl?: string;

  @ApiProperty({ example: 'TSH-001', description: '상품코드' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ type: [CreateProductInfoDto], description: '옵션 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductInfoDto)
  productInfos: CreateProductInfoDto[];
}
