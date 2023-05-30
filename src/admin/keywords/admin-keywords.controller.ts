import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller('admin-keywords')
export class AdminKeywordsController {
  @Get()
  @Render('admin-keywords')
  async prepareForm(@Query('keywords') theKeywords: string) {
    const keywords = theKeywords.split("\n").map(keyword => keyword.trim()).filter(keyword => !!keyword);
    return { keywords }
  }
}
