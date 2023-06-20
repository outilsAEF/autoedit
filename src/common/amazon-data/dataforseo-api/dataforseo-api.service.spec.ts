import { Test, TestingModule } from '@nestjs/testing';
import { DataforseoApiService } from './dataforseo-api.service';

describe('DataforseoApiService', () => {
  let service: DataforseoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataforseoApiService],
    }).compile();

    service = module.get<DataforseoApiService>(DataforseoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
