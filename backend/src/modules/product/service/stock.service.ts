import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@generated/prisma/client';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repository/stock.repository';
import { ProductInfoRepository } from '../repository/product-info.repository';

@Injectable()
export class StockService {
  constructor(
    private stockRepository: StockRepository,
    private productInfoRepository: ProductInfoRepository,
  ) {}

  async getStock(product_info_id: number) {
    if (!product_info_id) throw new BadRequestException('잘못된 요청입니다.');
    return await this.stockRepository.count(product_info_id);
  }

  async decrementStock(
    product_info_id: number,
    version: number,
    qty: number,
    tx?: Prisma.TransactionClient,
  ) {
    if (!product_info_id || !qty || !version)
      throw new ForbiddenException('잘못된 접근입니다.');
    return await this.stockRepository.update(product_info_id, version, qty, tx);
  }

  async update(product_info_id: number, dto: UpdateStockDto) {
    const product = await this.productInfoRepository.findById(product_info_id);
    if (!product) throw new ForbiddenException('잘못된 접근입니다.');
    return await this.stockRepository.update(
      product_info_id,
      dto.version,
      dto.qty,
    );
  }
}
