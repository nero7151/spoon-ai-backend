import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreate } from './dto/user-create.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'generated/prisma';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Request() req: { user: User }): Promise<User> {
    return await this.userService.findOne(req.user.id);
  }

  @Get('me/recipes')
  @UseGuards(JwtAuthGuard)
  async myRecipes(@Request() req: { user: User }) {
    return this.userService.getRecipes(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: Partial<User>,
  ): Promise<User> {
    return await this.userService.update(id, user);
  }

  @Post('register')
  async register(@Body() userCreate: UserCreate): Promise<User> {
    return await this.userService.register(userCreate);
  }
}
