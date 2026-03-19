import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto, CreateProductInfoDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['productInfos'] as const),
) {}

export class UpdateProductInfoDto extends PartialType(
   OmitType(CreateProductInfoDto, [] as const),
){}
