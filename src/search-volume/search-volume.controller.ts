import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchVolumeService } from './search-volume.service';

@Controller('api/search-volume')
export class SearchVolumeController {
  constructor(private readonly searchVolumeService: SearchVolumeService) { }
  @Get()
  async findByKeyword(@Query('keyword') keyword: string) {
    console.log(`[keyword-${keyword}] searchVolume`);
    const ahrefsSearchVolume = await this.searchVolumeService.findAhrefsSearchVolume(keyword);
    return JSON.stringify(Object.fromEntries(ahrefsSearchVolume));
  }
}
