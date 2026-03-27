import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { OrderService } from '@modules/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private orderService: OrderService,
    private readonly httpService: HttpService,
  ) {}
  async confirm(dto: UpdatePaymentDto) {
    //order 검증
    const order = await this.orderService.findOneById(dto.ordrId);
    if (!order) throw new ForbiddenException('잘못된 접근입니다.');

    //amount와 요청시 보낸 가격 맞는지 확인
    if (dto.amount !== order.total_price)
      throw new ForbiddenException('잘못된 접근입니다.');

    //toss api 호출
    const data = await firstValueFrom(
      this.httpService
        .post<any>(
          'https://api.tosspayments.com/v1/payments/confirm',
          {
            paymentKey: dto.paymentKey,
            amount: dto.amount,
            orderId: dto.ordrId,
          },
          {
            headers: {
              Authorization:
                //XXXX todo 나중에 토큰
                'Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==',
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError(async (error: AxiosError) => {
            console.log(error);
            //실패 업데이트
            await this.orderService.updateOrder(dto.ordrId, {
              status: 'FAILED',
            });
            throw new Error(error.message);
          }),
        ),
    );

    await this.orderService.updateOrder(dto.ordrId, { status: 'PAID' });
    console.log(data);

    //XXXX todo 결제 기록 저장해야될듯!
  }
}
