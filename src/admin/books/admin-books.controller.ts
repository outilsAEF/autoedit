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
    const categoriesId = book.categories.map(({ id }) => id);
    console.log({ categoriesId })

    console.time('findByCategoryId');
    const bestsellers = await this.categoriesService.findBestSellersByCategoryId(categoriesId[0]);
    console.timeEnd('findByCategoryId');
    console.log({ bestsellers })

    return {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    };
    // res.render('admin-books', {
    //   title: `Auto Edit - Informations sur l'ASIN ${asin}`,
    //   book,
    // });

  }
}
