import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';

@Module({ controllers: [BooksController], providers: [BooksService, AmazonPaapiService] })
export class BooksModule { }
