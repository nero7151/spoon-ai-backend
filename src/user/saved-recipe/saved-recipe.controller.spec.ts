import { Test, TestingModule } from '@nestjs/testing';
import { SavedRecipeController } from './saved-recipe.controller';

describe('SavedRecipeController', () => {
  let controller: SavedRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedRecipeController],
    }).compile();

    controller = module.get<SavedRecipeController>(SavedRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
