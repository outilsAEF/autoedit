import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { BooksService } from 'src/books/books.service';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, BooksService, AmazonPaapiService, RainforestApiService]
})
export class CategoriesModule { }
