import { Module } from '@nestjs/common';
import { SavedRecipeController } from './saved-recipe.controller';
import { SavedRecipeService } from './saved-recipe.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SavedRecipeController],
  providers: [SavedRecipeService, PrismaService],
  exports: [SavedRecipeService],
})
export class SavedRecipeModule {}
