import { Module } from '@nestjs/common';
import { SavedRecipeController } from './saved-recipe.controller';
import { SavedRecipeService } from './saved-recipe.service';

@Module({
  controllers: [SavedRecipeController],
  providers: [SavedRecipeService],
})
export class SavedRecipeModule {}
