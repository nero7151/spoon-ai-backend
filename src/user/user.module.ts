import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { SavedRecipeModule } from './saved-recipe/saved-recipe.module';
import { RequirementModule } from './requirement/requirement.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
  imports: [SavedRecipeModule, RequirementModule],
})
export class UserModule {}
