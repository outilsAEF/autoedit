import { Controller, Get, Query, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Response } from 'express';
import { SearchBooksDto } from './dto/search-books.dto';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get() // 2205088165 or B09ZYQRVQB
  async findByAsin(@Res() res: Response, @Query() qs: SearchBooksDto) {
    const book = await this.booksService.findByAsin(qs.asin);

    res.render('books', {
      title: `Auto Edit - Informations sur l'ASIN ${qs.asin}`,
      book,
    });
  }
}
