import { Controller, Get, Query, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Response } from 'express';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get() // 2205088165 or B09ZYQRVQB
  async findByAsin(@Res() res: Response, @Query('asin') asin: string) {
    const book = await this.booksService.findByAsin(asin);

    res.render('books', {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    });
  }
}
