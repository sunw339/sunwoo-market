import { Injectable } from '@nestjs/common';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repository/stock.repository';

@Injectable()
export class StockService {
  constructor(private stockRepository: StockRepository){}

  async update(product_info_id: number, updateStockDto: UpdateStockDto) {
    // product info validation 추가하기
    return await this.stockRepository.update(product_info_id, updateStockDto);
  }
}
