import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return await this.prisma.product.create({ data });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      where: { deleted_at: null },
      include: {
        product_infos: {
          where: { deleted_at: null },
          include: { stock: true },
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        product_infos: {
          where: { deleted_at: null },
          include: { stock: true },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
