import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { UserService } from './user/user.service';

@Module({
  imports: [UserModule, ProductModule, OrderModule],
  controllers: [OrderController],
  providers: [UserService, ProductService, OrderService],
})
export class AppModule {}
