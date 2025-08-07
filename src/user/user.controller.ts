import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreate } from './dto/user-create.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { User } from 'generated/prisma';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Request() req: { user: User }): User {
    return req.user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): string {
    return 'User with ID: ' + id;
  }

  @Post('register')
  async register(@Body() userCreate: UserCreate) {
    return await this.userService.register(userCreate);
  }
}
