import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { StockModule } from './stock/stock.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    StockModule,
    AuthModule,
  ],
})
export class AppModule {}
