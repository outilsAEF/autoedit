import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amazonPaapi from 'amazon-paapi';
import { Author, Book, Category, Variant } from './entities/book.entity';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { InvalidASINException } from './books.exceptions';
setupCache(axios, { ttl: 1000 * 60 * 60 * 4 }); // 4 hours

const CATEGORY_NODE_NAME_TO_NOT_DISPLAY = ['Catégories'];
const CATEGORY_TREE_TO_NOT_SHOW_CONTAINS = 'Self Service';

@Injectable()
export class BooksService {
  constructor(private readonly configService: ConfigService) { }
  async findByAsin(asin: string): Promise<Book> {
    console.log('BookService with asin', asin);

    console.log('Getting info from Amazon PAAPI');

    const partnerTag = this.configService.get<string>('PAAPI_PARTNER_TAG');
    const commonParameters = {
      AccessKey: this.configService.get<string>('PAAPI_ACCESS_KEY'),
      SecretKey: this.configService.get<string>('PAAPI_SECRET_KEY'),
      PartnerTag: partnerTag,
      PartnerType: this.configService.get<string>('PAAPI_PARTNER_TYPE'),
      Marketplace: this.configService.get<string>('PAAPI_MARKETPLACE'),
    };

    const requestParameters = {
      ItemIds: [asin],
      IdemIdType: 'ASIN',
      Resources: [
        'BrowseNodeInfo.BrowseNodes',
        'BrowseNodeInfo.BrowseNodes.Ancestor',
        'BrowseNodeInfo.BrowseNodes.SalesRank',
      ],
    };

    let books;
    try {
      books = await amazonPaapi.GetItems(commonParameters, requestParameters);
    } catch (error) {
      if (!error.response) throw new InternalServerErrorException('Could not connect to third party API');

      console.error(
        'Error while getting results from Amazon:',
        error.response.body.Errors
      );
      if (error.response.body.Errors[0].Code === 'InvalidParameterValue')
        throw new InvalidASINException(error.response.body.Errors[0].Message, asin);
    }

    const bookFromPAAPI = books.ItemsResult.Items[0];

    const categoriesNotFiltered: Category[] =
      bookFromPAAPI.BrowseNodeInfo.BrowseNodes.sort((a, b) => {
        return +b.SalesRank || 0 - +a.SalesRank || 0;
      }).map((node): Category =>
      ({
        id: node.Id,
        title: node.DisplayName,
        url: `https://www.amazon.fr/gp/bestsellers/books/${node.Id}?tag=${partnerTag}`,
        ...(node.SalesRank && { rank: node.SalesRank }),
        categoryTree: getFullCategory(node),
      })
      );

    const categories = filterCategories(categoriesNotFiltered);

    console.log(`[asin=${asin}] - Fetching from Rain Forest API`);
    console.time(`[asin=${asin}] - Fetching from Rain Forest API`);
    const bookFromRainforestAPI = await this.getBookFromRainforestAPI(asin);
    console.timeEnd(`[asin=${asin}] - Fetching from Rain Forest API`);
    console.log(`[asin=${asin}] - Fetched from Rain Forest API :`, bookFromRainforestAPI);





    const book: Book = {
      asin,
      authors: bookFromRainforestAPI.authors.map(
        ({ name, link }): Author => ({ name, url: link })
      ),
      // coverUrl: bookFromPAAPI.Images.Primary.Medium.URL,
      coverUrl: bookFromRainforestAPI.main_image.link,
      // title: bookFromPAAPI.ItemInfo.Title.DisplayValue,
      title: bookFromRainforestAPI.title,
      // url: bookFromPAAPI.DetailPageURL,
      url: bookFromRainforestAPI.link,
      categories,
      globalRank: (bookFromRainforestAPI.bestsellers_rank && bookFromRainforestAPI.bestsellers_rank[0]?.rank) || undefined,
      hasAPlusContent: bookFromRainforestAPI.a_plus_content?.has_a_plus_content,
      rating: {
        value: bookFromRainforestAPI.rating,
        number: bookFromRainforestAPI.ratings_total
      },
      variants: bookFromRainforestAPI.variants?.map(
        ({ asin, title, link, is_current_product }): Variant => ({ asin, type: title, url: link, isCurrent: is_current_product })),
      publicationDate: bookFromRainforestAPI.publication_date

    };

    return book;
  }

  async findKindleRankingByAsin(asin: string): Promise<number | undefined> {
    // console.log(`[asin=${asin}] - findKindleRankingByAsin - with asin`, asin);

    // // console.log(`[asin=${asin}] - Fetching from Rain Forest API`);
    // console.time(`[asin=${asin}] - findKindleRankingByAsin - Fetching from Rain Forest API`);
    const ranking = await this.getKindleRankingFromRainforestAPI(asin);
    // console.timeEnd(`[asin=${asin}] - findKindleRankingByAsin - Fetching from Rain Forest API`);

    return ranking;
  }

  // private async getCategoriesFromRainforestAPI(
  //   categoriesId: number[]
  // ): Promise<Category[]> {
  //   console.log(
  //     `getCategoriesFromRainforestAPI with categoriesId ${categoriesId}`
  //   );
  //   const categories = await Promise.all(
  //     categoriesId.map((id) => {
  //       return this.getCategoryFromRainforestAPI(id);
  //     })
  //   );
  //   return categories.filter(
  //     (category) => category !== undefined
  //   ) as Category[];
  // }

  // private async getCategoryFromRainforestAPI(
  //   id: number
  // ): Promise<Category | undefined> {
  //   console.log(`getCategoryFromRainforestAPI with categoryId ${id}`);
  //   const axiosParams = {
  //     api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
  //     amazon_domain: 'amazon.fr',
  //     id,
  //     type: 'standard',
  //     // include_fields:
  //     //   'product.title,product.link,product.authors,product.categories,product.main_image,product.bestsellers_rank',
  //   };

  //   let response;
  //   try {
  //     response = await axios.get('https://api.rainforestapi.com/categories', {
  //       params: axiosParams,
  //     });
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response) {
  //         console.error(
  //           `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Categories API for categoryId ${id}: ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
  //         );
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log('Error', error.message);
  //       }
  //       return;
  //     }
  //   }

  //   if (!(response && response.data))
  //     throw new HttpException(
  //       'Internal server error while requesting Rainforest API: response or response.data are undefined. Please check your logs',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );

  //   const data = response.data;
  //   const categoryFromRainforestAPI = data.category;
  //   // console.log('response from axios', bookRainForestAPI);
  //   console.log(
  //     `category name ${categoryFromRainforestAPI.name} category full path ${categoryFromRainforestAPI.path}`
  //   );

  //   const partnerTag = this.configService.get<string>('PAAPI_PARTNER_TAG');
  //   return {
  //     name: categoryFromRainforestAPI.name,
  //     url: `https://www.amazon.fr/gp/bestsellers/books/${id}?tag=${partnerTag}`,
  //     // ...(node.SalesRank && { rank: node.SalesRank }),
  //     categoryTree: categoryFromRainforestAPI.path,
  //   };
  // }

  private async getKindleRankingFromRainforestAPI(asin: string): Promise<number | undefined> {
    const axiosParams = {
      api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
      amazon_domain: 'amazon.fr',
      asin,
      type: 'product',
      include_fields:
        'product.bestsellers_rank',
    };

    let response;
    try {
      response = await axios.get('https://api.rainforestapi.com/request', {
        params: axiosParams,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Product API (ASIN) : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
          );
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        throw new HttpException(
          'Internal server error while requesting Rainforest API, please check your logs',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    if (!(response && response.data))
      throw new HttpException(
        'Internal server error while requesting Rainforest API: response or response.data are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const data = response.data;
    const bookFromRainforestAPI = data.product;
    // console.log('response from axios', bookRainForestAPI);
    // console.log(`Reading from Rainforest API - ASIN: ${bookFromRainforestAPI.asin}`);
    // console.log(`Reading from Rainforest API - Title: ${bookFromRainforestAPI.title}`);
    // console.log(`Reading from Rainforest API - Bestseller rank? ${bookFromRainforestAPI.bestsellers_rank ? 'true' : 'false'}`);

    const rank = bookFromRainforestAPI.bestsellers_rank ? bookFromRainforestAPI.bestsellers_rank[0].rank : undefined;
    // console.log(`[asin=${asin}] kindle ranking: ${rank}`);

    return rank;
  }

  private async getBookFromRainforestAPI(asin: string) {
    const axiosParams = {
      api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
      amazon_domain: 'amazon.fr',
      asin,
      type: 'product',
      include_fields:
        'product.asin,product.title,product.link,product.authors,product.main_image,product.bestsellers_rank,product.variants,product.rating,product.ratings_total,product.a_plus_content,product.publication_date',
    };

    let response;
    try {
      response = await axios.get('https://api.rainforestapi.com/request', {
        params: axiosParams,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Product API (ASIN) : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
          );
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        throw new HttpException(
          'Internal server error while requesting Rainforest API, please check your logs',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    if (!(response && response.data))
      throw new HttpException(
        'Internal server error while requesting Rainforest API: response or response.data are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const data = response.data;
    const bookFromRainforestAPI = data.product;
    // console.log('response from axios', bookRainForestAPI);
    // console.log(`Reading from Rainforest API - ASIN: ${bookFromRainforestAPI.asin}`);
    // console.log(`Reading from Rainforest API - Title: ${bookFromRainforestAPI.title}`);
    // console.log(`Reading from Rainforest API - Bestseller rank? ${bookFromRainforestAPI.bestsellers_rank ? 'true' : 'false'}`);

    // console.log(
    //   'kindle ranking',
    //   (bookFromRainforestAPI.bestsellers_rank && bookFromRainforestAPI.bestsellers_rank[0].rank) || 'n/a'
    // );
    return bookFromRainforestAPI;
  }
}

const getFullCategory = (node): string => {
  let categoryTree = '';
  if (!node.Ancestor) {
    categoryTree = node.DisplayName;
  } else if (!CATEGORY_NODE_NAME_TO_NOT_DISPLAY.includes(node.DisplayName)) {
    categoryTree = getFullCategory(node.Ancestor)
      .concat(' > ')
      .concat(node.DisplayName);
  } else {
    categoryTree = getFullCategory(node.Ancestor);
  }
  return categoryTree;
};

const filterCategories = (categories: Category[]): Category[] => {
  return categories.filter(
    (category) =>
      !category.categoryTree.includes(CATEGORY_TREE_TO_NOT_SHOW_CONTAINS)
  );
};
