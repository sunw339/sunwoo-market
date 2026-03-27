import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { StockService } from './service/stock.service';
import { ProductController } from './controller/product.controller';
import { ProductRepository } from './repository/product.repository';
import { ProductInfoRepository } from './repository/product-info.repository';
import { StockRepository } from './repository/stock.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    StockService,
    ProductRepository,
    ProductInfoRepository,
    StockRepository,
  ],
  exports: [ProductService, StockService],
})
export class ProductModule {}
