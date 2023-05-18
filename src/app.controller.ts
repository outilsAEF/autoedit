import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { PublicPath } from './common/decorators/public.decorator';

@Controller()
@PublicPath()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getIndex(@Res() res: Response) {
    console.log('AutoEdit - homepage');
    return res.render('books', { title: 'AutoEdit - Cherchez un ASIN' });
  }
}
