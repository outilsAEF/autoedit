import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { SearchVolumeController } from './search-volume/search-volume.controller';
import { SearchVolumeService } from './search-volume/search-volume.service';
import { SearchVolumeModule } from './search-volume/search-volume.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BooksModule,
    SearchVolumeModule,
  ],
  controllers: [AppController, SearchVolumeController],
  providers: [AppService, SearchVolumeService],
})
export class AppModule {}
