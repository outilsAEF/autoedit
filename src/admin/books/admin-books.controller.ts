import { Controller, Get, Query, Render, UseFilters } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { SearchBooksDto } from 'src/books/dto/search-books.dto';
import { InvalidAsinExceptionFilter } from 'src/common/filters/invalid-asin-exception.filter';

@Controller('admin-books')
// @UseInterceptors(WrapAdminResponseInterceptor)
export class AdminBooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get() // 2205088165 or B09ZYQRVQB
  @Render('admin-books')
  @UseFilters(new InvalidAsinExceptionFilter())
  async findByAsins(@Query() { asins }: SearchBooksDto) {
    /* 
    B09ZYQRVQB 2205088165 B019LPMZ2K
    */
    console.log({ asins });

    console.time('findByAsins');
    const book = await this.booksService.findByAsin(asins[0]);
    console.timeEnd('findByAsins');

    return {
      title: `Auto Edit ADMIN - Informations sur l'ASIN ${asins[0]}`,
      book,
    }

  }
}
