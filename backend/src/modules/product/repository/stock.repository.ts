import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class StockRepository {
  constructor(private prisma: PrismaService) {}

  async count(product_info_id: number) {
    return await this.prisma.stock.findUnique({
      where: { product_info_id },
      select: { qty: true, version: true },
    });
  }

  async update(product_info_id: number, data: Prisma.StockUpdateInput) {
    return await this.prisma.stock.update({
      where: { product_info_id: product_info_id },
      data: {
        qty: data.qty,
        version: { increment: 1 },
      },
    });
  }
}
