import { Module } from '@nestjs/common';
import { AdminBooksModule } from './books/admin-books.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [AdminBooksModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminParamGuard
    // }
  ],
  controllers: [AdminController]
})
export class AdminModule { }
