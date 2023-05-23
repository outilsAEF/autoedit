import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bestsellers } from 'src/books/entities/book.entity';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly rainforestApiService: RainforestApiService) { }

  async findBestSellersByCategoryId(categoryId: number): Promise<Bestsellers[]> {
    return await this.rainforestApiService.findBestSellersByCategoryId(categoryId);

  }

}
