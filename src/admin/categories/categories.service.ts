import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { Top } from 'src/books/entities/book.entity';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

const WANTED_TOPS = [1, 3, 5, 30];


@Injectable()
export class CategoriesService {
  constructor(
    private readonly rainforestApiService: RainforestApiService,
    private readonly booksService: BooksService) { }

  async findTopsByCategoryId(id: number): Promise<Top[]> {
    const bestsellers = await this.rainforestApiService.findBestSellersByCategoryId(id);

    const bestSellersFilteredByPosition = bestsellers.filter(({ position }) => WANTED_TOPS.includes(+position));

    const tops = await Promise.all(bestSellersFilteredByPosition.map(async ({ asin, position }) => {
      const globalRank = await this.booksService.findGlobalRankByAsin(asin);
      const topRanking = globalRank?.rank;
      console.log(`[category-${id}] [asin-${asin}] position: ${position} topRanking: ${topRanking}`)
      return {
        position,
        topRanking
      }
    }));
    return tops;
  }

  calculateScore(tops: Top[]): number {
    return tops.reduce((prev, curr) => prev + (curr.topRanking || 0), 0);
  }

}
