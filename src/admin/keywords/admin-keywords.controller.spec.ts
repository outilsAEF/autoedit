import { Test, TestingModule } from '@nestjs/testing';
import { AdminKeywordsController } from './admin-keywords.controller';

describe('AdminKeywordsController', () => {
  let controller: AdminKeywordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminKeywordsController],
    }).compile();

    controller = module.get<AdminKeywordsController>(AdminKeywordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
