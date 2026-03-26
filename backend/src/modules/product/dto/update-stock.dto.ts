import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class UpdateStockDto {
    @ApiProperty({ example: 3, description: '수량' })
    @IsInt()
    @Min(0)
    qty: number

    @ApiProperty({ example: 1, description: 'version' })
    @IsInt()
    @IsPositive()
    version: number
}
