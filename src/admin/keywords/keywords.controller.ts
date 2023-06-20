import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { DataforseoApiService } from 'src/common/amazon-data/dataforseo-api/dataforseo-api.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('api/keywords')
export class KeywordsController {
  constructor(
    private readonly rainforestApiService: RainforestApiService,
    private readonly searchVolumeService: DataforseoApiService) { }

  @Get('/total-results')
  async findTotalResultsByKeyword(@Query('keyword') keyword: string) {
    const totalResults = await this.rainforestApiService.findTotalResultsByKeyword(keyword);
    console.log(`[keyword=${keyword}] findTotalResultsByKeyword - totalResults: ${totalResults}`);
    return {
      totalResults
    }
  }

  @Get('/search-volume')
  @UseFilters(new HttpExceptionFilter())
  async getSearchVolumeForKeywords(@Query('keywords') keyword: string) {
    const keywords = keyword.split(',');
    // const volume =
    const searchVolumes = await this.searchVolumeService.getSearchVolumeForKeywords(keywords);
    console.log(`[keywords] getSearchVolumeForKeywords - searchVolumes:`, searchVolumes);
    return { searchVolumes }
  }


}
