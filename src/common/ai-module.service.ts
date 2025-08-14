// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { RecipeGenerationResult } from './openai.service';

// @Injectable()
// export class AIModuleService {
//   private readonly aiModuleUrl: string;

//   constructor() {
//     this.aiModuleUrl = process.env.AI_MODULE_URL || 'http://localhost:8000';
//   }

//   async generateRecipe(
//     userRequirement: string,
//     basicRequirement?: string,
//   ): Promise<RecipeGenerationResult> {
//     const prompt = this.buildPrompt(userRequirement, basicRequirement);

//     try {
//       const response = await fetch(`${this.aiModuleUrl}/generate-recipe`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//           max_length: 2000,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`AI Module API error: ${response.status}`);
//       }

//       const result = await response.json();

//       // Transform AI module response to our expected format
//       return this.transformResponse(result);
//     } catch (error) {
//       console.error('Error calling AI Module:', error);
//       const errorMessage =
//         error instanceof Error ? error.message : 'Unknown error';
//       throw new HttpException(
//         `Failed to generate recipe with AI Module: ${errorMessage}`,
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   private buildPrompt(
//     userRequirement: string,
//     basicRequirement?: string,
//   ): string {
//     let prompt = `레시피를 생성해주세요:\n\n`;

//     if (basicRequirement) {
//       prompt += `기본 요구사항: ${basicRequirement}\n`;
//     }

//     prompt += `구체적인 요청: ${userRequirement}\n\n`;

//     prompt += `다음 형식으로 응답해주세요:
// 제목: [레시피 제목]
// 설명: [요리 설명]
// 재료: [재료 목록]
// 조리법: [단계별 조리법]
// 조리시간: [시간(분)]
// 인분: [몇 인분]
// 난이도: [쉬움/보통/어려움]
// 태그: [요리 태그들]`;

//     return prompt;
//   }

//   private transformResponse(aiResponse: any): RecipeGenerationResult {
//     // AI Module의 응답을 파싱하여 우리 형식에 맞게 변환
//     // 이 부분은 AI Module의 실제 응답 형식에 따라 조정이 필요합니다

//     const text = aiResponse.generated_text || aiResponse.text || '';

//     // 간단한 파싱 로직 (실제로는 더 정교한 파싱이 필요할 수 있습니다)
//     return {
//       title: this.extractField(text, '제목') || '생성된 레시피',
//       description: this.extractField(text, '설명') || '맛있는 요리입니다.',
//       ingredients: this.extractArrayField(text, '재료') || ['재료 정보 없음'],
//       instructions: this.extractArrayField(text, '조리법') || [
//         '조리법 정보 없음',
//       ],
//       cookingTime: parseInt(this.extractField(text, '조리시간') || '30'),
//       servings: parseInt(this.extractField(text, '인분') || '4'),
//       difficulty: this.extractDifficulty(text),
//       tags: this.extractArrayField(text, '태그') || ['기타'],
//     };
//   }

//   private extractField(text: string, fieldName: string): string | null {
//     const regex = new RegExp(`${fieldName}:\\s*(.+?)(?=\\n|$)`, 'i');
//     const match = text.match(regex);
//     return match ? match[1].trim() : null;
//   }

//   private extractArrayField(text: string, fieldName: string): string[] | null {
//     const field = this.extractField(text, fieldName);
//     if (!field) return null;

//     // 쉼표로 분리하거나 줄바꿈으로 분리
//     return field
//       .split(/[,\n]/)
//       .map((item) => item.trim())
//       .filter((item) => item.length > 0);
//   }

//   private extractDifficulty(text: string): 'easy' | 'medium' | 'hard' {
//     const difficulty = this.extractField(text, '난이도');
//     if (!difficulty) return 'medium';

//     if (difficulty.includes('쉬움') || difficulty.includes('easy'))
//       return 'easy';
//     if (difficulty.includes('어려움') || difficulty.includes('hard'))
//       return 'hard';
//     return 'medium';
//   }
// }
