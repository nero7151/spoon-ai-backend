import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { SavedRecipeService } from './saved-recipe.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('saved-recipe')
export class SavedRecipeController {
  constructor(private readonly savedRecipeService: SavedRecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async toggle(@Req() req: any, @Body('recipe_id') recipeId: number) {
    const userId = req.user.id;
    return this.savedRecipeService.toggleSavedRecipe(userId, recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    const userId = req.user.id;
    return this.savedRecipeService.listSavedRecipes(userId);
  }
}
