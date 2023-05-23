import { Test, TestingModule } from '@nestjs/testing';
import { RainforestApiService } from './rainforest-api.service';

describe('RainforestApiService', () => {
  let service: RainforestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RainforestApiService],
    }).compile();

    service = module.get<RainforestApiService>(RainforestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
