import { Controller, Get, Param } from '@nestjs/common';
import { SearchVolumeService } from './search-volume.service';

@Controller('search-volume')
export class SearchVolumeController {
  constructor(private readonly searchVolumeService: SearchVolumeService) { }
  @Get(':keyword')
  async findByKeyword(@Param('keyword') keyword: string) {
    console.log(`[keyword=${keyword}] searchVolume`);
    // const volume =
    await this.searchVolumeService.findByKeyword(keyword);
  }
}
