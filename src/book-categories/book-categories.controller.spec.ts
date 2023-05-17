import { Test, TestingModule } from '@nestjs/testing';
import { BookCategoriesController } from './book-categories.controller';

describe('BookCategoriesController', () => {
  let controller: BookCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCategoriesController],
    }).compile();

    controller = module.get<BookCategoriesController>(BookCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
