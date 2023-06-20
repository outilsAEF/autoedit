import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) { }

  @Get()
  async findTopsAndScoreByCategoryId(@Query('id') id: number) {
    console.log(`[category-${id}] findTopsAndScoreByCategoryId`);

    const tops = await this.categoriesService.findTopsByCategoryId(id);

    const score = this.categoriesService.calculateScore(tops);


    return {
      tops,
      score
    }

  }


}
