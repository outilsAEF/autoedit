import { Controller, Get, Query, Render, UseFilters } from '@nestjs/common';
import { BooksService } from './books.service';
import { InvalidAsinExceptionFilter } from 'src/common/filters/invalid-asin-exception.filter';
import { PublicPath } from 'src/common/decorators/public.decorator';
import { SearchBookDto } from './dto/search-book.dto';

@Controller('book')
@PublicPath()
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get() // 2205088165 or B09ZYQRVQB
  @Render('books')
  @UseFilters(new InvalidAsinExceptionFilter())
  async findByAsin(@Query() { asin }: SearchBookDto) {

    const book = await this.booksService.findByAsin(asin);

    return {
      title: 'Outil SEO Auteur : Catégories KDP et meta-data associées à votre ASIN ou ISBN10',
      metaDescription: 'Optimisez le référencement SEO de votre livre avec notre outil SEO KDP. Entrez un ASIN ou ISBN10 et découvrez les catégories KDP et meta-data associées 👉',
      isPublic: true,
      book
    };

  }
}
