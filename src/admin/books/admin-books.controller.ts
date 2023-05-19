import { Controller, Get, Query, Render, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { BooksService } from 'src/books/books.service';
import { SearchBooksDto } from 'src/books/dto/search-books.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { InvalidAsinExceptionFilter } from 'src/common/filters/invalid-asin-exception.filter';
import { WrapAdminResponseInterceptor } from 'src/common/interceptors/wrap-admin-response.interceptor';

@Controller('admin-books')
// @UseInterceptors(WrapAdminResponseInterceptor)
export class AdminBooksController {
  constructor(private readonly booksService: BooksService, private readonly categoriesService: CategoriesService) { }

  @Get() // 2205088165 or B09ZYQRVQB
  @Render('admin-books')
  @UseFilters(new InvalidAsinExceptionFilter())
  async findByAsin(@Res() res: Response, @Query() { asin }: SearchBooksDto) {

    console.time('findByAsin');
    const book = await this.booksService.findByAsin(asin);
    console.timeEnd('findByAsin');
    const categories = book.categories;
    console.log({ categoriesId: book.categories.map(({ id }) => id) })

    console.time('findBestSellersByCategoryId');
    const categoriesWithBestSellers = await Promise.all(categories.map(async category => {
      const bestsellers = await this.categoriesService.findBestSellersByCategoryId(category.id)
      return {
        ...category,
        bestsellers
      }
    }));
    console.timeEnd('findBestSellersByCategoryId');
    console.log({ categoriesWithBestSellers })

    const WANTED_TOPS = [1, 3, 5, 30];

    console.time('findKindleRanking for tops bestsellers');
    const categoriesWithTops = await Promise.all(categoriesWithBestSellers.map(async (categoryWithBestsellers) => {
      const bestSellersFilteredByPosition = categoryWithBestsellers.bestsellers.filter(({ position }) => WANTED_TOPS.includes(+position));
      console.log(bestSellersFilteredByPosition.length);
      const tops = await Promise.all(bestSellersFilteredByPosition.map(async (bestseller) => {
        const topRanking = await this.booksService.findKindleRankingByAsin(bestseller.asin);
        return {
          ...bestseller,
          topRanking
        }
      }));

      const score = tops.reduce((prev, curr) => prev + (curr.topRanking || 0), 0);

      return {
        ...categoryWithBestsellers,
        tops,
        score
      }
    }));
    console.timeEnd('findKindleRanking for tops bestsellers');

    console.log(categoriesWithTops);

    return {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
      categoriesWithTops
    };
    // res.render('admin-books', {
    //   title: `Auto Edit - Informations sur l'ASIN ${asin}`,
    //   book,
    // });

  }
}
