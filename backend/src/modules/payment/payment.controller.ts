import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('confirm')
  async confirm(@Body() dto: UpdatePaymentDto) {
    return await this.paymentService.confirm(dto);
  }
}
