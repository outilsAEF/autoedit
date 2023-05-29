import { Module } from '@nestjs/common';
import { AdminBooksModule } from './books/admin-books.module';
import { AdminController } from './admin.controller';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [AdminBooksModule, KeywordsModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminParamGuard
    // }
  ],
  controllers: [AdminController]
})
export class AdminModule { }
