import { Controller, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { StockService } from '../service/stock.service';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@generated/prisma/enums';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':product_info_id')
  update(
    @Param('product_info_id') product_info_id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(product_info_id, updateStockDto);
  }
}
