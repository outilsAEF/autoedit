import { Module } from '@nestjs/common';
import { AdminBooksModule } from './books/admin-books.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminParamGuard } from 'src/common/guards/admin-param.guard';

@Module({
  imports: [AdminBooksModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminParamGuard
    }
  ]
})
export class AdminModule { }
