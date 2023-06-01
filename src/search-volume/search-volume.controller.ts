import { Controller, Get, Query, Res } from '@nestjs/common';
import { SearchVolumeService } from './search-volume.service';
import { Response } from 'express';
@Controller('api/search-volume')
export class SearchVolumeController {
  constructor(private readonly searchVolumeService: SearchVolumeService) { }
  @Get()
  async findAhrefsSearchVolumeByKeyword(@Res() res: Response, @Query('keyword') keyword: string) {
    console.log(`[keyword-${keyword}] findAhrefsSearchVolumeByKeyword`);
    // const ahrefsSearchVolume = await this.searchVolumeService.findAhrefsSearchVolume(keyword);
    // return JSON.stringify(Object.fromEntries(ahrefsSearchVolume));
    const image = await this.searchVolumeService.findAhrefsSearchVolume(keyword);
    res.contentType("image/png");
    res.set("Content-Disposition", "inline;");
    res.send(image)
  }
}
