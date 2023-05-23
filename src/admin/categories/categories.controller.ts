import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { BooksService } from 'src/books/books.service';

@Controller('api/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly booksService: BooksService) { }

  @Get()
  async findTopsByCategoryId(@Query('id') id: number) {
    console.log(`[category-${id}] findTopsByCategoryId`);

    // console.time(`[category-${id}] findTopsByCategoryId`);
    const bestsellers = await this.categoriesService.findBestSellersByCategoryId(id);

    // console.log(`[category-${id}]`, { bestsellers })

    const WANTED_TOPS = [1, 3, 5, 30];

    const bestSellersFilteredByPosition = bestsellers.filter(({ position }) => WANTED_TOPS.includes(+position));
    const tops = await Promise.all(bestSellersFilteredByPosition.map(async ({ asin, position }) => {
      const topRanking = await this.booksService.findKindleRankingByAsin(asin);
      console.log(`[category-${id}] [asin-${asin}] position: ${position} topRanking: ${topRanking}`)
      return {
        position,
        topRanking
      }
    }));

    const score = tops.reduce((prev, curr) => prev + (curr.topRanking || 0), 0);

    // console.timeEnd(`[category-${id}] findTopsByCategoryId`);

    return {
      tops,
      score
    }



    // // RANDOM
    // const randomTimeout = Math.random() * 10000;
    // await new Promise((resolve) => setTimeout(resolve, randomTimeout));

    // const tops: ({ position: number; topRanking: number })[] = [
    //   { position: 1, topRanking: Math.ceil(Math.random() * 100) },
    //   { position: 3, topRanking: Math.ceil(Math.random() * 1000) },
    //   { position: 5, topRanking: Math.ceil(Math.random() * 10000) },
    //   { position: 30, topRanking: Math.ceil(Math.random() * 100000) }
    // ]
    // const score = tops.reduce((prev, curr) => prev + (curr.topRanking || 0), 0);



    // return { tops, score };

  }

  // const categoriesWithTops = [
  //   {
  //     categoryTree: 'Ebook > cat2 > cat3 > cat4',
  //     id: 2,
  //     url: 'fakeurl',
  //     rank: 5, tops: [{
  //       position: 1, topRanking: 3
  //     }, {
  //       position: 3, topRanking: 30
  //     }, {
  //       position: 5, topRanking: 3786
  //     }, {
  //       position: 30, topRanking: 376768
  //     }]
  //   },
  //   {
  //     categoryTree: 'Livre > Electronique > cat3 > cat4',
  //     id: 54,
  //     url: 'fakeurl',
  //     rank: 12, tops: [{
  //       position: 1, topRanking: 6
  //     }, {
  //       position: 3, topRanking: 67
  //     }, {
  //       position: 5, topRanking: 890
  //     }, {
  //       position: 30, topRanking: 8765
  //     }]
  //   },
  // ]
}
