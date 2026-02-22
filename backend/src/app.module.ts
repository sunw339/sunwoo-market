import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { MoService } from './co/mo/mo.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule],
  controllers: [AppController, OrderController],
  providers: [AppService, UserService, MoService, ProductService, OrderService],
})
export class AppModule {}
