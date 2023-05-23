import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { BooksService } from 'src/books/books.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, BooksService]
})
export class CategoriesModule { }
