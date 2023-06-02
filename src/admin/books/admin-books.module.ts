import { Module } from '@nestjs/common';
import { AdminBooksController } from './admin-books.controller';
import { BooksService } from 'src/books/books.service';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Module({
  controllers: [AdminBooksController],
  providers: [BooksService, AmazonPaapiService, RainforestApiService]
})
export class AdminBooksModule { }
