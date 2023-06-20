import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { TimeLoggerMiddleware } from './common/middleware/time-logger.middleware';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './admin/categories/categories.module';
import { DataforseoApiService } from './common/amazon-data/dataforseo-api/dataforseo-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BooksModule,
    AdminModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataforseoApiService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeLoggerMiddleware).forRoutes('*')
  }
}
