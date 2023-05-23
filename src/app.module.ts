import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { SearchVolumeController } from './search-volume/search-volume.controller';
import { SearchVolumeService } from './search-volume/search-volume.service';
import { SearchVolumeModule } from './search-volume/search-volume.module';
import { CategoriesService } from './admin/categories/categories.service';
import { TimeLoggerMiddleware } from './common/middleware/time-logger.middleware';
import { AdminModule } from './admin/admin.module';
import { CategoriesController } from './admin/categories/categories.controller';
import { CategoriesModule } from './admin/categories/categories.module';
import { BooksService } from './books/books.service';
import { AmazonPaapiService } from './common/amazon-data/amazon-paapi.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BooksModule,
    SearchVolumeModule,
    AdminModule,
    CategoriesModule,
  ],
  controllers: [AppController, SearchVolumeController, CategoriesController],
  providers: [AppService, SearchVolumeService, CategoriesService, BooksService, AmazonPaapiService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeLoggerMiddleware).forRoutes('*')
  }
}
