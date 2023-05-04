import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get(':asin') // 2205088165 or B09ZYQRVQB
  async findByAsin(@Param('asin') asin: string) {
    const book = await this.booksService.findByAsin(asin);

    return `
      <h4>Titre</h1>
      <a href='${book.url}'>${book.title}</a>

      <h4>ASIN</h4>
      ${book.asin}

      <h4>Auteur(s)</h4>
      ${book.authors.join('&nbsp;;&nbsp;')}

      <h4>Image</h4>
      <img src='${book.coverUrl}'>

      <h4>Catégories</h4>
      <ul>
        <li>Boutique Kindle (classement global): ${book.globalRank}</li>
        ${book.categories
          .map((category) => {
            return `<li><a href='${category.url}'>${category.categoryTree}</a>${
              category.rank ? '&nbsp; (Classement: ' + category.rank + ')' : ''
            }</li>`;
          })
          .join('')}</ul>
    `;
  }
}
