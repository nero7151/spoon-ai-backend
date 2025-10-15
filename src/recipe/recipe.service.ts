import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Recipe, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { RecipeGenerate } from './dto/recipe-generate.dto';
import { RequirementService } from 'src/user/requirement/requirement.service';
import { UserService } from 'src/user/user.service';
import {
  OpenAIService,
  RecipeGenerationResult,
} from 'src/common/openai.service';
// import { AIModuleService } from 'src/common/ai-module.service';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requirementService: RequirementService,
    private readonly userService: UserService,
    private readonly openaiService: OpenAIService,
    // private readonly aiModuleService: AIModuleService,
  ) {}

  async findAll(): Promise<Recipe[]> {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        requirement: true,
        user: true,
        _count: {
          select: { reviews: true },
        },
      },
    });

    // Compute average rating for each recipe when score is null or to ensure up-to-date
    const results = await Promise.all(
      recipes.map(async (r) => {
        if (typeof (r as any).score === 'number' && (r as any).score !== null)
          return r;

        const agg = await this.prisma.review.aggregate({
          where: { recipe_id: r.id },
          _avg: { rating: true },
        });

        const avg = agg._avg.rating;
        return { ...r, score: avg ?? null } as any;
      }),
    );

    return results as any;
  }

  async findOne(where: Prisma.RecipeWhereUniqueInput): Promise<Recipe | null> {
    // If fetching by id, increment view count and include reviews
    if ((where as any).id) {
      const id = (where as any).id as number;
      return await this.prisma.recipe.update({
        where: { id },
        data: { views: { increment: 1 } },
        include: {
          requirement: true,
          user: true,
          reviews: {
            include: { user: true },
            orderBy: { created_at: 'desc' },
          },
        },
      });
    }

    return await this.prisma.recipe.findUnique({
      where,
      include: {
        requirement: true,
        user: true,
        reviews: {
          include: { user: true },
          orderBy: { created_at: 'desc' },
        },
      },
    });
  }

  async generate(user: User, recipeGenerate: RecipeGenerate): Promise<Recipe> {
    const foundUser = await this.userService.findOne(user.id);

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const requirement = await this.requirementService.findOne({
      id: recipeGenerate.requirement_id,
    });

    if (!requirement) {
      throw new HttpException('Requirement not found', HttpStatus.NOT_FOUND);
    }

    const recipe = await this.findOne({
      requirement_id: requirement.id,
      user_id: foundUser.id,
    });

    if (recipe) {
      throw new HttpException(
        'Requirement already has a recipe',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify the requirement belongs to the user
    if (requirement.user_id !== foundUser.id) {
      throw new HttpException(
        'Requirement does not belong to user',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      // Choose AI service based on environment variable
      // const useOpenAI = process.env.USE_OPENAI === 'true';

      // if (useOpenAI) {
      // Generate recipe using OpenAI GPT-5
      const generatedRecipe: RecipeGenerationResult =
        await this.openaiService.generateRecipe(
          requirement.content,
          foundUser.requirement_basic || undefined,
        );
      // } else {
      // Generate recipe using internal AI Module
      // generatedRecipe = await this.aiModuleService.generateRecipe(
      //   requirement.content,
      //   foundUser.requirement_basic || undefined,
      // );
      // }

      // Create recipe in database with generated content
      const recipe = await this.prisma.recipe.create({
        data: {
          title: generatedRecipe.title,
          description: `${generatedRecipe.description}

재료:
${generatedRecipe.ingredients.join('\n')}

조리 시간: ${generatedRecipe.cookingTime} 분

인분: ${generatedRecipe.servings}

난이도: ${generatedRecipe.difficulty}

조리 방법:
${generatedRecipe.instructions.join('\n')}

태그:
${generatedRecipe.tags.join(', ')}`,
          user_id: foundUser.id,
          requirement_id: requirement.id,
        },
        include: {
          requirement: true,
          user: true,
        },
      });

      return recipe;
    } catch (error) {
      console.error('Error generating recipe:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        `Failed to generate recipe: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(userId: number, recipeId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    }
    if (recipe.user_id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.prisma.recipe.delete({ where: { id: recipeId } });
    return { deleted: true };
  }
}
