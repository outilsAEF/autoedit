import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { SearchVolumeController } from './search-volume/search-volume.controller';
import { SearchVolumeService } from './search-volume/search-volume.service';
import { SearchVolumeModule } from './search-volume/search-volume.module';
import { AdminBooksModule } from './admin-books/admin-books.module';
import { CategoriesService } from './categories/categories.service';
import { TimeLoggerMiddleware } from './common/middleware/time-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BooksModule,
    SearchVolumeModule,
    AdminBooksModule,
  ],
  controllers: [AppController, SearchVolumeController],
  providers: [AppService, SearchVolumeService, CategoriesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeLoggerMiddleware).forRoutes('*')
  }
}
