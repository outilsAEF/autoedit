import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidASINException } from 'src/books/books.exceptions';
import { BooksService } from 'src/books/books.service';
import { SearchBooksDto } from 'src/books/dto/search-books.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('admin-books-33hf3ux')
export class AdminBooksController {
  constructor(private readonly booksService: BooksService, private readonly categoriesService: CategoriesService) { }
  @Get() // 2205088165 or B09ZYQRVQB
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


    res.render('admin-books', {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    });

  }
}
