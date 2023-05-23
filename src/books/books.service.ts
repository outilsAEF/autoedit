import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Author, Book, Category, Variant } from './entities/book.entity';
// import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { InvalidASINException } from './books.exceptions';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
// setupCache(axios, { ttl: 1000 * 60 * 60 * 4 }); // 4 hours



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


