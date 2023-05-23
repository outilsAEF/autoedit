import { Controller, Get, Query, Res, UseFilters } from '@nestjs/common';
import { BooksService } from './books.service';
import { Response } from 'express';
import { SearchBooksDto } from './dto/search-books.dto';
import { InvalidAsinExceptionFilter } from 'src/common/filters/invalid-asin-exception.filter';
import { PublicPath } from 'src/common/decorators/public.decorator';

@Controller('book')
@PublicPath()
export class BooksController {
  constructor(private readonly booksService: BooksService) { }
  @Get() // 2205088165 or B09ZYQRVQB
  @UseFilters(new InvalidAsinExceptionFilter())
  async findByAsin(@Res() res: Response, @Query() { asin }: SearchBooksDto) {

    const book = await this.booksService.findByAsin(asin);

    res.render('books', {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    });

  }
}
