import { Controller, Get, Param, Render } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get(':asin') // 2205088165 or B09ZYQRVQB
  @Render('books')
  async findByAsin(@Param('asin') asin: string) {
    const book = await this.booksService.findByAsin(asin);

    return { book };
  }
}
