import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@generated/prisma/client';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { OrderRepository } from './order.repository';
import { PrismaService } from '@modules/prisma/prisma.service';
import { StockService } from '@modules/product/service/stock.service';
import { ProductService } from '@modules/product/service/product.service';

interface StockVersion {
  version: number;
  qty: number;
}

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private stockService: StockService,
    private productService: ProductService,
    private prisma: PrismaService,
  ) {}

  async create(user_id: number, dto: CreateOrderDto) {
    if (!user_id) throw new UnauthorizedException('유효하지 않은 주문입니다');

    //1.중복 주문 여부 확인
    const existing = await this.orderRepository.findOneByKey(
      dto.idempotency_key,
    );
    if (existing) return existing;

    //재고확인
    const versions = new Map<number, StockVersion>();

    let total_price = 0;

    await Promise.all(
      dto.items.map(async (item: OrderItemDto) => {
        const stock = await this.stockService.getStock(item.product_info_id);
        const productInfo = await this.productService.findProductInfoById(
          item.product_info_id,
        );
        if (!productInfo)
          throw new BadRequestException('주문 가격이 잘못 되었습니다.');

        const clientPrice = item.snapshot_price;
        let serverPrice = productInfo.price;
        if (productInfo.discount_rate > 0)
          serverPrice =
            productInfo.price - serverPrice * (productInfo.discount_rate / 100);

        if (serverPrice !== clientPrice)
          throw new BadRequestException('주문 가격이 잘못 되었습니다.');

        if (!stock || stock.qty - item.amount < 0)
          throw new BadRequestException('재고가 없습니다.');

        total_price += clientPrice * item.amount;

        versions.set(item.product_info_id, {
          version: stock.version,
          qty: stock.qty - item.amount,
        });
      }),
    );

    return await this.prisma.$transaction(async (tx) => {
      //재고 차감
      await Promise.all(
        dto.items.map(async (item) => {
          const stockVersion = versions.get(item.product_info_id);
          if (!stockVersion)
            throw new BadRequestException('재고 정보를 찾을 수 없습니다.');

          const { count } = await this.stockService.decrementStock(
            item.product_info_id,
            stockVersion.version,
            stockVersion.qty,
            tx,
          );
          if (!count) throw new BadRequestException('재고가 없습니다.');
        }),
      );

      //주문 생성
      return await this.orderRepository.create(user_id, total_price, dto, tx);
    });
  }

  async findOneById(id: number) {
    return await this.orderRepository.findOneById(id);
  }

  async updateOrder(id: number, data: Prisma.OrderUpdateInput) {
    return await this.orderRepository.update(id, data);
  }
}
