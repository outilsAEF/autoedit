import { Module } from '@nestjs/common';
import { AdminBooksModule } from './books/admin-books.module';
import { AdminController } from './admin.controller';
import { AdminKeywordsModule } from './keywords/admin-keywords.module';

@Module({
  imports: [AdminBooksModule, AdminKeywordsModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminParamGuard
    // }
  ],
  controllers: [AdminController]
})
export class AdminModule { }
