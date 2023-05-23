import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Module({ controllers: [BooksController], providers: [BooksService, AmazonPaapiService, RainforestApiService] })
export class BooksModule { }
