import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Author, Book, Category, Variant } from './entities/book.entity';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { InvalidASINException } from './books.exceptions';
import { AmazonPaapiService } from 'src/common/amazon-data/amazon-paapi.service';
setupCache(axios, { ttl: 1000 * 60 * 60 * 4 }); // 4 hours



@Injectable()
export class BooksService {
  constructor(private readonly configService: ConfigService, private readonly amazonPaapiService: AmazonPaapiService) { }

  async findByAsin(asin: string): Promise<Book> {
    console.log('BookService with asin', asin);

    console.time(`[asin=${asin}] - Fetching from Amazon Product Advertising API`);
    const categories = await this.amazonPaapiService.findCategoriesByAsin(asin);
    console.timeEnd(`[asin=${asin}] - Fetching from Amazon Product Advertising API`);

    console.time(`[asin=${asin}] - Fetching from Rainforest API`);
    const bookFromRainforestAPI = await this.getBookFromRainforestAPI(asin);
    console.timeEnd(`[asin=${asin}] - Fetching from Rainforest API`);





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


