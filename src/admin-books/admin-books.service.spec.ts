import { Test, TestingModule } from '@nestjs/testing';
import { AdminBooksService } from './admin-books.service';

describe('AdminBooksService', () => {
  let service: AdminBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBooksService],
    }).compile();

    service = module.get<AdminBooksService>(AdminBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
