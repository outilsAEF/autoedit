
import { ConfigService } from '@nestjs/config';
import { Book } from './entities/book.entity';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { Injectable } from '@nestjs/common';



@Injectable()
export class BooksService {
  constructor(
    private readonly configService: ConfigService,
    private readonly amazonPaapiService: AmazonPaapiService,
    private readonly rainforestApiService: RainforestApiService) { }

  async findByAsin(asin: string): Promise<Book> {
    console.log(`[asin=${asin}] - booksService.findByAsin`);

    // console.time(`[asin=${asin}] - Fetching categories from Amazon Product Advertising API`);
    const categories = await this.amazonPaapiService.findCategoriesByAsin(asin);
    // console.timeEnd(`[asin=${asin}] - Fetching categories from Amazon Product Advertising API`);

    // console.time(`[asin=${asin}] - Fetching book info from Rainforest API`);
    const bookFromRainforestAPI = await this.rainforestApiService.findBookByAsin(asin);
    // console.timeEnd(`[asin=${asin}] - Fetching book info from Rainforest API`);


    return { categories, ...bookFromRainforestAPI };
  }

  async findKindleRankingByAsin(asin: string): Promise<number | undefined> {
    console.log(`[asin=${asin}] - booksService.findKindleRankingByAsin`);

    // // console.log(`[asin=${asin}] - Fetching from Rain Forest API`);
    // console.time(`[asin=${asin}] - findKindleRankingByAsin - Fetching from Rain Forest API`);
    const ranking = await this.rainforestApiService.findKindleRankingByAsin(asin);
    // console.timeEnd(`[asin=${asin}] - findKindleRankingByAsin - Fetching from Rain Forest API`);

    return ranking;
  }
}


