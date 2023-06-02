import { Controller, Get, Query, Render } from '@nestjs/common';
import { SearchKeywordsDto } from './dto/search-keywords.dto';

@Controller('admin-keywords')
export class AdminKeywordsController {
  @Get()
  @Render('admin-keywords')
  async prepareForm(@Query() { keywords }: SearchKeywordsDto) {
    return { keywords }
  }
}
