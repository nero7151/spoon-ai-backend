import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { SavedRecipeModule } from './user/saved-recipe/saved-recipe.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, AuthModule, RecipeModule, SavedRecipeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
