import { Module } from '@nestjs/common';
import { ReviewModule } from './review/review.module';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { OpenAIService } from 'src/common/openai.service';
import { RequirementModule } from 'src/user/requirement/requirement.module';
// import { AIModuleService } from 'src/common/ai-module.service';

@Module({
  imports: [UserModule, RequirementModule, ReviewModule],
  providers: [
    RecipeService,
    PrismaService,
    OpenAIService /* AIModuleService */,
  ],
  controllers: [RecipeController],
})
export class RecipeModule {}
