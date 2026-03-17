import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async findAll() {
    return this.prisma.product.findMany({
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
    return this.prisma.product.findUnique({
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
    return this.prisma.product.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
