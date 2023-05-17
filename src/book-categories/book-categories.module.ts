import { Module } from '@nestjs/common';
import { BookCategoriesController } from './book-categories.controller';
import { BookCategoriesService } from './book-categories.service';
import { BooksService } from 'src/books/books.service';

@Module({
  controllers: [BookCategoriesController],
  providers: [BookCategoriesService, BooksService]
})
export class BookCategoriesModule { }
