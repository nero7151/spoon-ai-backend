import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SavedRecipeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleSavedRecipe(userId: number, recipeId: number) {
    const existing = await this.prisma.savedRecipe.findUnique({
      where: { user_id_recipe_id: { user_id: userId, recipe_id: recipeId } },
    });

    if (existing) {
      await this.prisma.savedRecipe.delete({ where: { id: existing.id } });
      return { saved: false };
    }

    await this.prisma.savedRecipe.create({
      data: { user_id: userId, recipe_id: recipeId },
    });
    return { saved: true };
  }

  async listSavedRecipes(userId: number) {
    return this.prisma.savedRecipe.findMany({
      where: { user_id: userId },
      include: {
        recipe: {
          include: {
            requirement: true,
            user: true,
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
