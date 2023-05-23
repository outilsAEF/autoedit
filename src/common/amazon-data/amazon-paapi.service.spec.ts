import { Test, TestingModule } from '@nestjs/testing';
import { AmazonPaapiService } from './amazon-paapi.service';

describe('AmazonPaapiService', () => {
  let service: AmazonPaapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmazonPaapiService],
    }).compile();

    service = module.get<AmazonPaapiService>(AmazonPaapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
