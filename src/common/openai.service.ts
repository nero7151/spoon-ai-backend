import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface RecipeGenerationResult {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateRecipe(
    userRequirement: string,
    basicRequirement?: string,
  ): Promise<RecipeGenerationResult> {
    const prompt = this.buildPrompt(userRequirement, basicRequirement);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional chef and recipe creator. You create detailed, practical recipes based on user requirements. Always respond in Korean language.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'recipe_generation',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'The title of the recipe',
                },
                description: {
                  type: 'string',
                  description: 'A brief description of the dish',
                },
                ingredients: {
                  type: 'array',
                  description: 'List of ingredients with specific measurements',
                  items: {
                    type: 'string',
                  },
                },
                instructions: {
                  type: 'array',
                  description: 'Step-by-step cooking instructions',
                  items: {
                    type: 'string',
                  },
                },
                cookingTime: {
                  type: 'number',
                  description: 'Cooking time in minutes',
                  minimum: 1,
                },
                servings: {
                  type: 'number',
                  description: 'Number of servings',
                  minimum: 1,
                },
                difficulty: {
                  type: 'string',
                  description: 'Difficulty level of the recipe',
                  enum: ['easy', 'medium', 'hard'],
                },
                tags: {
                  type: 'array',
                  description:
                    'Tags describing the recipe (cuisine type, dietary info, etc.)',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: [
                'title',
                'description',
                'ingredients',
                'instructions',
                'cookingTime',
                'servings',
                'difficulty',
                'tags',
              ],
              additionalProperties: false,
            },
          },
        },
      });

      console.log('OpenAI response:', completion.choices);

      const message = completion.choices[0]?.message;
      if (!message) {
        throw new Error('No response from OpenAI');
      }

      // Check for refusal
      if (message.refusal) {
        throw new Error(
          `OpenAI refused to generate recipe: ${message.refusal}`,
        );
      }

      const responseContent = message.content;
      if (!responseContent) {
        throw new Error('No content in OpenAI response');
      }

      // Parse the JSON response
      const recipeData = JSON.parse(responseContent) as RecipeGenerationResult;

      // Validate the response structure
      this.validateRecipeResponse(recipeData);

      return recipeData;
    } catch (error) {
      console.error('Error generating recipe with OpenAI:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate recipe: ${errorMessage}`);
    }
  }

  private buildPrompt(
    userRequirement: string,
    basicRequirement?: string,
  ): string {
    let prompt = `Create a detailed recipe based on the following requirements:\n\n`;

    if (basicRequirement) {
      prompt += `Basic Requirements: ${basicRequirement}\n`;
    }

    prompt += `Specific Request: ${userRequirement}\n\n`;

    prompt += `Requirements:
- Make the recipe practical and achievable
- Include specific measurements in ingredients
- Provide clear, step-by-step instructions
- Consider dietary restrictions if mentioned
- Suggest appropriate cooking time and servings
- Add relevant tags (cuisine type, dietary info, etc.)
- Use Korean ingredients and cooking methods when appropriate`;

    return prompt;
  }

  private validateRecipeResponse(
    recipe: unknown,
  ): asserts recipe is RecipeGenerationResult {
    if (!recipe || typeof recipe !== 'object') {
      throw new Error('Recipe must be an object');
    }

    const recipeObj = recipe as Record<string, unknown>;

    const requiredFields = [
      'title',
      'description',
      'ingredients',
      'instructions',
      'cookingTime',
      'servings',
      'difficulty',
      'tags',
    ];

    for (const field of requiredFields) {
      if (!(field in recipeObj)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (
      !Array.isArray(recipeObj.ingredients) ||
      recipeObj.ingredients.length === 0
    ) {
      throw new Error('Ingredients must be a non-empty array');
    }

    if (
      !Array.isArray(recipeObj.instructions) ||
      recipeObj.instructions.length === 0
    ) {
      throw new Error('Instructions must be a non-empty array');
    }

    if (
      typeof recipeObj.difficulty !== 'string' ||
      !['easy', 'medium', 'hard'].includes(recipeObj.difficulty)
    ) {
      throw new Error('Difficulty must be easy, medium, or hard');
    }

    if (
      typeof recipeObj.cookingTime !== 'number' ||
      recipeObj.cookingTime <= 0
    ) {
      throw new Error('Cooking time must be a positive number');
    }

    if (typeof recipeObj.servings !== 'number' || recipeObj.servings <= 0) {
      throw new Error('Servings must be a positive number');
    }

    if (!Array.isArray(recipeObj.tags)) {
      throw new Error('Tags must be an array');
    }

    if (typeof recipeObj.title !== 'string' || !recipeObj.title.trim()) {
      throw new Error('Title must be a non-empty string');
    }

    if (
      typeof recipeObj.description !== 'string' ||
      !recipeObj.description.trim()
    ) {
      throw new Error('Description must be a non-empty string');
    }
  }
}
