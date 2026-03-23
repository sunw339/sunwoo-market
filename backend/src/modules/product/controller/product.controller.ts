import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@generated/prisma/enums';
import { ProductService } from '../service/product.service';
import {
  CreateProductDto,
  CreateProductInfoDto,
} from '../dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductInfoDto,
} from '../dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.remove(id);
  }

  //상품 옵션
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':productId/options/:id')
  async updateOption(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductInfoDto,
  ) {
    return await this.productService.updateOption(productId, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':productId/options')
  async createOption(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateProductInfoDto,
  ) {
    return await this.productService.createOption(productId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':productId/options/:id')
  async deleteOption(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.productService.deleteOption(productId, id);
  }
}
