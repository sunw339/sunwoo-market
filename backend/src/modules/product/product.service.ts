import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(dto: CreateProductDto) {
    return this.productRepository.create({
      name: dto.name,
      description: dto.description,
      image_url: dto.imageUrl,
      thumb_url: dto.thumbUrl,
      code: dto.code,
      product_infos: {
        create: dto.productInfos.map((info) => ({
          name: info.name,
          price: info.price,
          currency: info.currency,
          discount_rate: info.discountRate,
          status: info.status,
          stock: {
            create: { qty: info.stockQty },
          },
        })),
      },
    });
  }

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id);
    return this.productRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findById(id);
    return this.productRepository.softDelete(id);
  }
}