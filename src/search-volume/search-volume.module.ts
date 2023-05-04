import { Module } from '@nestjs/common';
import { SearchVolumeController } from './search-volume.controller';
import { SearchVolumeService } from './search-volume.service';

@Module({
  controllers: [SearchVolumeController],
  providers: [SearchVolumeService],
})
export class SearchVolumeModule {}
