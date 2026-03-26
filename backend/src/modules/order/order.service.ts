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
import { ProductInfoRepository } from '@modules/product/repository/product-info.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository,
    private productInfoRepository: ProductInfoRepository,
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
    const versions = new Map()

    let total_price = 0
    
    await Promise.all(
      dto.items.map(async (item: OrderItemDto) => {
        const stock = await this.stockRepository.count(item.product_info_id);
        const price = await this.productInfoRepository.findById(item.product_info_id)
        if(!price) throw new BadRequestException('주문 가격이 잘못 되었습니다.')

        let clientPrice = item.snapshot_price
        let serverPrice = price.price
        if(price?.discount_rate && price?.discount_rate > 0) 
          serverPrice = price?.price - (serverPrice * (price?.discount_rate/100))

        if(serverPrice !== clientPrice) throw new BadRequestException('주문 가격이 잘못 되었습니다.')
      
        if (!stock || stock.qty - item.amount < 0)
          throw new BadRequestException('재고가 없습니다.');

        total_price += clientPrice * item.amount

        versions.set(item.product_info_id, {version : stock.version, qty: stock.qty - item.amount })
      }),
    );

    return await this.prisma.$transaction(async (tx) => {
      //재고 차감
      await Promise.all(dto.items.map(async(item) => {
        const { version, qty } = versions.get(item.product_info_id)
        const { count } = await this.stockRepository.update(item.product_info_id, version, qty, tx)
        if(!count) throw new BadRequestException('재고가 없습니다.');
      }))

      //주문 생성
      return await this.orderRepository.create(user_id, total_price, dto, tx);
    });
  }
}
