import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { PrismaService } from '@modules/prisma/prisma.service';
import { StockRepository } from '@modules/product/repository/stock.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository,
    private prisma: PrismaService,
  ) {}
  async create(user_id: number, dto: CreateOrderDto) {
    if (!user_id) throw new UnauthorizedException('유효하지 않은 주문입니다');

    const existing = await this.orderRepository.findOneByKey(
      dto.idempotency_key,
    );
    if (existing) return existing;

    //재고확인
    await Promise.all(
      dto.items.map(async (item: OrderItemDto) => {
        const stock = await this.stockRepository.count(item.product_info_id);
        if (!stock || stock.qty <= 0)
          throw new BadRequestException('재고가 없습니다.');
      }),
    );

    return await this.prisma.$transaction(async (tx) => {
      //주문 생성
      return await this.orderRepository.create(tx, user_id, dto);
    });
  }
}
