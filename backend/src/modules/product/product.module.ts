import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { ProductRepository } from './repository/product.repository';
import { ProductInfoRepository } from './repository/product-info.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductInfoRepository],
  exports: [ProductService],
})
export class ProductModule {}
