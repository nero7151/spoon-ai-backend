import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe, User } from 'generated/prisma';
import { RecipeGenerate } from './dto/recipe-generate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(): Promise<Recipe[]> {
    return await this.recipeService.findAll();
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(
    @Request() req: { user: User },
    @Body() requirement: RecipeGenerate,
  ): Promise<Recipe> {
    return await this.recipeService.generate(req.user, requirement);
  }
}
