import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidASINException } from 'src/books/books.exceptions';
import { BooksService } from 'src/books/books.service';
import { SearchBooksDto } from 'src/books/dto/search-books.dto';

@Controller('admin-book')
export class BookCategoriesController {
  constructor(private readonly booksService: BooksService) { }
  @Get() // 2205088165 or B09ZYQRVQB
  async findByAsin(@Res() res: Response, @Query() { asin }: SearchBooksDto) {

    const book = await this.booksService.findByAsin(asin);

    res.render('admin/books-top-categories', {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    });

  }
}
