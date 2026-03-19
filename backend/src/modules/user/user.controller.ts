import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { CurrentUserInfo } from '@modules/auth/interfaces/jwt-payload.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserInfo) {
    return this.userService.findById(user.userId);
  }
}
