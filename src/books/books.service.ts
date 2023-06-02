
import { Book, Category, GlobalRank } from './entities/book.entity';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { Injectable } from '@nestjs/common';
import { InvalidASINException } from './books.exceptions';

const CATEGORY_TREE_TO_NOT_SHOW_CONTAINS = 'Self Service';


@Injectable()
export class BooksService {
  constructor(
    private readonly amazonPaapiService: AmazonPaapiService,
    private readonly rainforestApiService: RainforestApiService) { }

  async findByAsin(asin: string): Promise<Book> {
    console.log(`[asin=${asin}] - booksService.findByAsin`);
    const { categories: unfilteredCategories, asinsWithErrors } = await this.amazonPaapiService.findCategoriesByAsinsWithSalesRank([asin]);
    if (asinsWithErrors) {
      throw new InvalidASINException('Invalid ASIN(s)', asin);
    }
    const filteredAndSortedCategories = removeUnwantedCategories(unfilteredCategories).sort(sortCategories);

    const noDuplicateCategories = removeDuplicatedCategories(filteredAndSortedCategories);

    const bookFromRainforestAPI = await this.rainforestApiService.findBookByAsin(asin);

    return { categories: noDuplicateCategories, ...bookFromRainforestAPI };

  }

  async findByAsins(asins: string[]): Promise<{ book: Book; asinsWithErrors?: string[] }> {
    console.log(`[asin=${asins[0]}] - booksService.findByAsins`);

    // console.time(`[asin=${asin}] - Fetching categories from Amazon Product Advertising API`);
    const firstAsin = asins[0];
    const firstAsinResult = await this.amazonPaapiService.findCategoriesByAsinsWithSalesRank([firstAsin]);
    if (firstAsinResult.asinsWithErrors) {
      throw new InvalidASINException('Invalid ASIN(s)', firstAsin);
    }

    let unfilteredCategories = firstAsinResult.categories;
    let asinsWithErrors: string[] | undefined;
    if (asins.length > 1) {
      const otherAsins = asins.slice(1);
      const otherAsinsResult = await this.amazonPaapiService.findCategoriesByAsinsWithoutSalesRank(otherAsins);
      unfilteredCategories = unfilteredCategories.concat(otherAsinsResult.categories);
      asinsWithErrors = otherAsinsResult.asinsWithErrors;
    }

    const filteredAndSortedCategories = removeUnwantedCategories(unfilteredCategories).sort(sortCategories);

    const noDuplicateCategories = removeDuplicatedCategories(filteredAndSortedCategories);

    const bookFromRainforestAPI = await this.rainforestApiService.findBookByAsin(firstAsin);

    return {
      book: {
        categories: noDuplicateCategories,
        ...bookFromRainforestAPI
      },
      asinsWithErrors
    };
  }

  async findGlobalRankByAsin(asin: string): Promise<GlobalRank | null> {
    console.log(`[asin=${asin}] - booksService.findGlobalRankByAsin`);

    const globalRank = await this.rainforestApiService.findGlobalRankByAsin(asin);
    return globalRank;

  }
}

const sortCategories = (catA: Category, catB: Category) => {
  return (catB.rank || 0) - (catA.rank || 0);
}

const removeUnwantedCategories = (categories: Category[]): Category[] => {
  return categories.filter(
    (category) =>
      !category.categoryTree.includes(CATEGORY_TREE_TO_NOT_SHOW_CONTAINS)
  );
};

const removeDuplicatedCategories = (categories: Category[]): Category[] => {
  return categories.filter(
    (category, index, categoriesArray) => categoriesArray.findIndex(someCat => (someCat.id === category.id)) === index)
}




