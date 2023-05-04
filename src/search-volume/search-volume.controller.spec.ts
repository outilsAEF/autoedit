import { Test, TestingModule } from '@nestjs/testing';
import { SearchVolumeController } from './search-volume.controller';

describe('SearchVolumeController', () => {
  let controller: SearchVolumeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchVolumeController],
    }).compile();

    controller = module.get<SearchVolumeController>(SearchVolumeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
