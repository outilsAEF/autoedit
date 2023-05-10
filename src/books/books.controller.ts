import { Controller, Get, Query, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { Response } from 'express';
import { SearchBooksDto } from './dto/search-books.dto';
import { InvalidASINException } from './books.exceptions';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get() // 2205088165 or B09ZYQRVQB
  async findByAsin(@Res() res: Response, @Query() { asin }: SearchBooksDto) {
    try {
      const book = await this.booksService.findByAsin(asin);

      res.render('books', {
        title: `Auto Edit - Informations sur l'ASIN ${asin}`,
        book,
      });
    } catch (error) {
      console.error(error);
      res.render('index', {
        title: `Erreur pour l'ASIN ${asin}`,
        error: {
          isInvalidASINError: error instanceof InvalidASINException,
          asin,
        },
      });
    }
  }
}
