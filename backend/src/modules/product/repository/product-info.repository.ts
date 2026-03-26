import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class ProductInfoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductInfoCreateInput) {
    return await this.prisma.productInfo.create({ data });
  }

  async findById(id: number) {
    return await this.prisma.productInfo.findFirst({
      where: { id, product: { deleted_at: null } },
    });
  }

  async update(id: number, data: Prisma.ProductInfoUpdateInput) {
    return await this.prisma.productInfo.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await this.prisma.productInfo.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
