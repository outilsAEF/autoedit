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
    return res.render('books', {
      title: 'Outil SEO Auteur : Catégories KDP et meta-data associées à votre ASIN ou ISBN10',
      metaDescription: 'Optimisez le référencement SEO de votre livre avec notre outil SEO KDP. Entrez un ASIN ou ISBN10 et découvrez les catégories KDP et meta-data associées 👉',
      isPublic: true
    });
  }
}
