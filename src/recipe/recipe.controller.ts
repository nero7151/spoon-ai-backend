import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe, User } from 'generated/prisma';
import { RecipeGenerate } from './dto/recipe-generate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Delete } from '@nestjs/common';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(): Promise<Recipe[]> {
    return await this.recipeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe | null> {
    return await this.recipeService.findOne({ id });
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(
    @Request() req: { user: User },
    @Body() requirement: RecipeGenerate,
  ): Promise<Recipe> {
    return await this.recipeService.generate(req.user, requirement);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Request() req: { user: User },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.recipeService.remove(req.user.id, id);
  }
}
