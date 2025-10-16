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
  Delete,
  ForbiddenException,
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

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getPreferences(@Request() req: { user: User }) {
    const pref = await this.userService.getPreferences(req.user.id);
    return { preferences: pref };
  }

  @Patch('preferences')
  @UseGuards(JwtAuthGuard)
  async setPreferences(
    @Body() body: { preferences: string },
    @Request() req: { user: User },
  ) {
    // allow user to set their own preferences (requirement_basic)
    const updated = await this.userService.setPreferences(
      req.user.id,
      body.preferences,
    );
    return { preferences: updated };
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
    @Request() req: { user: User },
  ): Promise<User> {
    // allow users to update only their own profile
    if (req.user.id !== id) {
      throw new ForbiddenException('Cannot update other user');
    }
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException('Cannot delete other user');
    }
    return await this.userService.remove(id);
  }

  @Post('register')
  async register(@Body() userCreate: UserCreate): Promise<User> {
    return await this.userService.register(userCreate);
  }
}
