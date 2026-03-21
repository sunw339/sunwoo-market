import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import {
  CreateProductDto,
  CreateProductInfoDto,
} from '../dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductInfoDto,
} from '../dto/update-product.dto';
import { ProductInfoRepository } from '../repository/product-info.repository';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private productInfoRepository: ProductInfoRepository,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productRepository.create({
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
    return await this.productRepository.update(id, dto);
  }

  async remove(id: number) {
    await this.findById(id);
    return await this.productRepository.softDelete(id);
  }

  async createOption(product_id: number, dto: CreateProductInfoDto) {
    await this.findById(product_id);

    return await this.productInfoRepository.create({
      product: { connect: { id: product_id } },
      ...dto,
    });
  }

  async updateOption(productId: number, id: number, dto: UpdateProductInfoDto) {
    await this.findById(productId);

    const option = await this.productInfoRepository.findByIdAndProductId(
      id,
      productId,
    );

    if (!option) throw new NotFoundException('상품을 찾을 수 없습니다');

    return await this.productInfoRepository.update(id, dto);
  }

  async deleteOption(product_id: number, id: number) {
    await this.findById(product_id);

    await this.productInfoRepository.findByIdAndProductId(id, product_id);

    return this.productInfoRepository.softDelete(id);
  }
}
