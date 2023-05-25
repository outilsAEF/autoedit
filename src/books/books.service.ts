
import { Book, GlobalRank } from './entities/book.entity';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { Injectable } from '@nestjs/common';
import { InvalidASINException } from './books.exceptions';


@Injectable()
export class BooksService {
  constructor(
    private readonly amazonPaapiService: AmazonPaapiService,
    private readonly rainforestApiService: RainforestApiService) { }

  async findByAsin(asin: string): Promise<Book> {
    console.log(`[asin=${asin}] - booksService.findByAsin`);
    const { categories, asinsWithErrors } = await this.amazonPaapiService.findCategoriesByAsinsWithSalesRank([asin]);
    if (asinsWithErrors) {
      throw new InvalidASINException('Invalid ASIN(s)', asin);
    }

    const bookFromRainforestAPI = await this.rainforestApiService.findBookByAsin(asin);

    return { categories, ...bookFromRainforestAPI };

  }

  async findByAsins(asins: string[]): Promise<{ book: Book; asinsWithErrors?: string[] }> {
    console.log(`[asin=${asins[0]}] - booksService.findByAsins`);

    // console.time(`[asin=${asin}] - Fetching categories from Amazon Product Advertising API`);
    const firstAsin = asins[0];
    const firstAsinResult = await this.amazonPaapiService.findCategoriesByAsinsWithSalesRank([firstAsin]);
    if (firstAsinResult.asinsWithErrors) {
      throw new InvalidASINException('Invalid ASIN(s)', firstAsin);
    }

    // const otherAsinsResult = await this.amazonPaapiService.findCategoriesByAsinsWithoutSalesRank(asins.slice(1));
    const otherAsins = asins.slice(1);
    const otherAsinsResult = await Promise.all(otherAsins.map(asin => this.amazonPaapiService.findCategoriesByAsinsWithoutSalesRank([asin])));
    const otherCategories = otherAsinsResult.map(asinResult => asinResult.categories).flat();
    const otherAsinErrors = otherAsinsResult.map(asinResult => asinResult.asinsWithErrors).filter(errors => !!errors).flat() as string[];

    const bookFromRainforestAPI = await this.rainforestApiService.findBookByAsin(firstAsin);

    return {
      book: {
        categories: firstAsinResult.categories.concat(otherCategories),
        ...bookFromRainforestAPI
      },
      asinsWithErrors: otherAsinErrors
    };
  }

  async findGlobalRankByAsin(asin: string): Promise<GlobalRank | null> {
    console.log(`[asin=${asin}] - booksService.findGlobalRankByAsin`);

    const globalRank = await this.rainforestApiService.findGlobalRankByAsin(asin);
    return globalRank;

  }
}


