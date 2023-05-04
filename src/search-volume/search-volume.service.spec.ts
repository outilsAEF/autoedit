import { Test, TestingModule } from '@nestjs/testing';
import { SearchVolumeService } from './search-volume.service';

describe('SearchVolumeService', () => {
  let service: SearchVolumeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchVolumeService],
    }).compile();

    service = module.get<SearchVolumeService>(SearchVolumeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
