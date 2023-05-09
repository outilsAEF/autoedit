import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get() // 2205088165 or B09ZYQRVQB
  @Render('books')
  async findByAsin(@Query('asin') asin: string) {
    const book = await this.booksService.findByAsin(asin);
    return { book };
  }
}
