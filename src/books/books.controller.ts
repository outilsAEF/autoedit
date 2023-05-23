import { Controller, Get, Query, Render, UseFilters } from '@nestjs/common';
import { BooksService } from './books.service';
import { SearchBooksDto } from './dto/search-books.dto';
import { InvalidAsinExceptionFilter } from 'src/common/filters/invalid-asin-exception.filter';
import { PublicPath } from 'src/common/decorators/public.decorator';

@Controller('book')
@PublicPath()
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get() // 2205088165 or B09ZYQRVQB
  @Render('books')
  @UseFilters(new InvalidAsinExceptionFilter())
  async findByAsin(@Query() { asin }: SearchBooksDto) {

    const book = await this.booksService.findByAsin(asin);

    return {
      title: `Auto Edit - Informations sur l'ASIN ${asin}`,
      book,
    };

  }
}
