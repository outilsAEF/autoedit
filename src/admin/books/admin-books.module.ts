import { Module } from '@nestjs/common';
import { AdminBooksController } from './admin-books.controller';
import { AdminBooksService } from './admin-books.service';
import { BooksService } from 'src/books/books.service';
import { CategoriesService } from 'src/admin/categories/categories.service';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';

@Module({
  controllers: [AdminBooksController],
  providers: [AdminBooksService, BooksService, CategoriesService, AmazonPaapiService]
})
export class AdminBooksModule { }
