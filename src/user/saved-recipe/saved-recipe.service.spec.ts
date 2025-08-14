import { Test, TestingModule } from '@nestjs/testing';
import { SavedRecipeService } from './saved-recipe.service';

describe('SavedRecipeService', () => {
  let service: SavedRecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedRecipeService],
    }).compile();

    service = module.get<SavedRecipeService>(SavedRecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
