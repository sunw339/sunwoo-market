import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class UpdateStockDto {
    @ApiProperty({ example: 3, description: '수량' })
    @Min(0)
    qty: number
}
