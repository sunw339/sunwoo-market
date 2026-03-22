import { Injectable } from '@nestjs/common';
import { Prisma } from '@generated/prisma/client';
import { OrderStatus } from '@generated/prisma/enums';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    user_id: number,
    dto: CreateOrderDto,
  ) {
    return tx.order.create({
      data: {
        idempotency_key: dto.idempotency_key,
        total_price: dto.total_price,
        user: { connect: { id: user_id } },
        order_infos: {
          create: dto.items.map((item) => ({
            product_info_id: item.product_info_id,
            snapshot_price: item.snapshot_price,
            amount: item.amount,
          })),
        },
      },
      include: { order_infos: true },
    });
  }

  async findAll(
    page: number,
    limit: number,
    orderBy: Prisma.OrderOrderByWithRelationInput,
  ) {
    return this.prisma.order.findMany({
      where: { deleted_at: null, status: { not: OrderStatus.PENDING } },
      skip: limit * page,
      take: limit,
      orderBy,
    });
  }

  async findAllByUserId(user_id: number) {
    return this.prisma.order.findMany({
      where: { user_id },
      include: { order_infos: true },
    });
  }

  async findOneByKey(idempotency_key: string) {
    return this.prisma.order.findUnique({ where: { idempotency_key } });
  }

  async findOneById(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.order.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
