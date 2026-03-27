import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({ example: 1, description: '주문 id' })
  @IsNotEmpty()
  @IsNumber()
  ordrId: number;

  @ApiProperty({
    example: 'dF4Ev_uACgnHA5IXDzEYU',
    description: 'toss payment key',
  })
  @IsNotEmpty()
  paymentKey: string;

  @ApiProperty({ example: 3, description: '수량' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
