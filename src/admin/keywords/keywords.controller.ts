import { Controller, Get, Query } from '@nestjs/common';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Controller('api/keywords')
export class KeywordsController {
  constructor(private readonly rainforestApiService: RainforestApiService) { }

  @Get()
  async findTotalResultsByKeyword(@Query('keyword') keyword: string) {
    const totalResults = await this.rainforestApiService.findTotalResultsByKeyword(keyword);
    console.log(`[keyword-${keyword}] findTotalResultsByKeyword - totalResults: ${totalResults}`);
    return {
      totalResults
    }
  }


}
