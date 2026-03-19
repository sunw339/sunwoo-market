import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Prisma } from '@generated/prisma/client';

@Injectable()
export class ProductInfoRepository {
  constructor(private prisma: PrismaService){}

  async findByIdAndProductId(id: number, productId: number) {
    return this.prisma.productInfo.findFirst({
      where: { id, product_id: productId },
    })
  }

  async update(id: number,data: Prisma.ProductInfoUpdateInput){
    return this.prisma.productInfo.update({where: {id}, data})
  }
}
