import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repository/stock.repository';
import { ProductInfoRepository } from '../repository/product-info.repository';

@Injectable()
export class StockService {
  constructor(
    private stockRepository: StockRepository,
    private productInfoRepository: ProductInfoRepository
  ){}

  async update(product_info_id: number, dto: UpdateStockDto) {
    const product = await this.productInfoRepository.findById(product_info_id)
    if(!product) throw new ForbiddenException('잘못된 접근입니다.')
    return await this.stockRepository.update(product_info_id, dto.version, dto.qty);
  }
}
