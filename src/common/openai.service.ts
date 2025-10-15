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
            content: `당신은 전문 셰프이자 레시피 작성가입니다. 사용자의 요구사항에 맞춰 상세하고 실용적인 레시피를 작성합니다. 응답은 항상 한국어로 해주세요.`,
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
                  description: '레시피 제목',
                },
                description: {
                  type: 'string',
                  description: '요리 소개(간단한 설명)',
                },
                ingredients: {
                  type: 'array',
                  description: '정량이 포함된 재료 목록',
                  items: {
                    type: 'string',
                  },
                },
                instructions: {
                  type: 'array',
                  description: '단계별 조리 방법',
                  items: {
                    type: 'string',
                  },
                },
                cookingTime: {
                  type: 'number',
                  description: '조리 시간(분)',
                  minimum: 1,
                },
                servings: {
                  type: 'number',
                  description: '몇 인분인지',
                  minimum: 1,
                },
                difficulty: {
                  type: 'string',
                  description: '난이도',
                  enum: ['easy', 'medium', 'hard'],
                },
                tags: {
                  type: 'array',
                  description: '레시피를 설명하는 태그(예: 한식, 채식 등)',
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

  console.log('OpenAI 응답:', completion.choices);

      const message = completion.choices[0]?.message;
      if (!message) {
        throw new Error('OpenAI로부터 응답이 없습니다');
      }

      // Check for refusal
      if (message.refusal) {
        throw new Error(
          `OpenAI가 레시피 생성을 거부했습니다: ${message.refusal}`,
        );
      }

      const responseContent = message.content;
      if (!responseContent) {
        throw new Error('OpenAI 응답에 내용이 없습니다');
      }

      // Parse the JSON response
  const recipeData = JSON.parse(responseContent) as RecipeGenerationResult;

      // Validate the response structure
      this.validateRecipeResponse(recipeData);

      return recipeData;
    } catch (error) {
      console.error('OpenAI로 레시피 생성 중 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';
      throw new Error(`레시피 생성에 실패했습니다: ${errorMessage}`);
    }
  }

  private buildPrompt(
    userRequirement: string,
    basicRequirement?: string,
  ): string {
    let prompt = `다음 요구사항을 바탕으로 상세한 레시피를 작성해주세요:\n\n`;

    if (basicRequirement) {
      prompt += `기본 요구사항: ${basicRequirement}\n`;
    }

    prompt += `세부 요청: ${userRequirement}\n\n`;

    prompt += `요구사항:
- 레시피는 실용적이고 현실적으로 작성할 것
- 재료에는 구체적인 계량을 포함할 것
- 명확한 단계별 조리 방법을 제공할 것
- 언급된 식이 제한(알레르기, 채식 등)을 고려할 것
- 적절한 조리 시간(분)과 인분 수를 제안할 것
- 관련 태그(요리 분류, 식이 정보 등)를 추가할 것
- 설명은 한국어로 작성할 것`;

    return prompt;
  }

  private validateRecipeResponse(
    recipe: unknown,
  ): asserts recipe is RecipeGenerationResult {
    if (!recipe || typeof recipe !== 'object') {
      throw new Error('레시피는 객체여야 합니다');
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
        throw new Error(`필수 필드가 없습니다: ${field}`);
      }
    }

    if (
      !Array.isArray(recipeObj.ingredients) ||
      recipeObj.ingredients.length === 0
    ) {
      throw new Error('재료는 비어있지 않은 배열이어야 합니다');
    }

    if (
      !Array.isArray(recipeObj.instructions) ||
      recipeObj.instructions.length === 0
    ) {
      throw new Error('조리 방법은 비어있지 않은 배열이어야 합니다');
    }

    if (
      typeof recipeObj.difficulty !== 'string' ||
      !['easy', 'medium', 'hard'].includes(recipeObj.difficulty)
    ) {
      throw new Error('난이도는 easy, medium, 또는 hard 중 하나여야 합니다');
    }

    if (
      typeof recipeObj.cookingTime !== 'number' ||
      recipeObj.cookingTime <= 0
    ) {
      throw new Error('조리 시간은 양수여야 합니다');
    }

    if (typeof recipeObj.servings !== 'number' || recipeObj.servings <= 0) {
      throw new Error('인분 수는 양수여야 합니다');
    }

    if (!Array.isArray(recipeObj.tags)) {
      throw new Error('태그는 배열이어야 합니다');
    }

    if (typeof recipeObj.title !== 'string' || !recipeObj.title.trim()) {
      throw new Error('제목은 비어있지 않은 문자열이어야 합니다');
    }

    if (
      typeof recipeObj.description !== 'string' ||
      !recipeObj.description.trim()
    ) {
      throw new Error('설명은 비어있지 않은 문자열이어야 합니다');
    }
  }
}
