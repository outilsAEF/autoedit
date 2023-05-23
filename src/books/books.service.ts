
import { Book, GlobalRank } from './entities/book.entity';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class BooksService {
  constructor(
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

  async findGlobalRankByAsin(asin: string): Promise<GlobalRank | null> {
    console.log(`[asin=${asin}] - booksService.findGlobalRankByAsin`);

    const globalRank = await this.rainforestApiService.findGlobalRankByAsin(asin);
    return globalRank;

  }
}


