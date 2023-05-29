import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { Author, Bestseller, BookWithoutCategories, GlobalRank, Variant } from 'src/books/entities/book.entity';
setupCache(axios, { ttl: 1000 * 60 * 60 * 4 }); // 4 hours

const ALLOWED_CATEGORIES_FOR_GLOBAL_RANK = ['Boutique Kindle', 'Livres'];


@Injectable()
export class RainforestApiService {

  private defaultApiParams: Record<string, string> = {
    api_key: '',
    amazon_domain: 'amazon.fr',
  };

  constructor(private readonly configService: ConfigService) {
    this.defaultApiParams.api_key = this.configService.get<string>('RAINFOREST_APIKEY') as string;

  }

  async findTotalResultsByKeyword(keyword: string): Promise<number> {
    const axiosParams = {
      ...this.defaultApiParams,
      search_term: keyword,
      type: 'search',
      include_fields:
        'pagination.total_results',

    }

    let response;
    try {
      response = await axios.get('https://api.rainforestapi.com/request', {
        params: axiosParams,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Product API (Keyword) : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
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
    const totalResults = data.pagination.total_results;


    return totalResults;
  }

  async findBookByAsin(asin: string): Promise<BookWithoutCategories> {
    const axiosParams = {
      ...this.defaultApiParams,
      asin,
      type: 'product',
      include_fields:
        'product.asin,product.title,product.link,product.authors,product.main_image,product.bestsellers_rank,product.variants,product.rating,product.ratings_total,product.a_plus_content,product.publication_date',

    }

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

    const book = convertBookFromRainforestApiToBook(bookFromRainforestAPI);

    return book;

  }



  async findGlobalRankByAsin(asin: string): Promise<GlobalRank | null> {
    const axiosParams = {
      ...this.defaultApiParams,
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

    const globalRank = getGlobalRank(bookFromRainforestAPI);

    return globalRank;
  }

  async findBestSellersByCategoryId(categoryId: number): Promise<Bestseller[]> {
    // console.log('CategoriesService with ids', categoryId);

    const axiosParams = {
      ...this.defaultApiParams,
      category_id: `bestsellers_${categoryId}`,
      type: 'bestsellers',
      include_fields: 'bestsellers.title,bestsellers.asin,bestsellers.position'
    }

    let response;
    try {
      response = await axios.get('https://api.rainforestapi.com/request', {
        params: axiosParams,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Product API (Bestsellers) : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
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

    if (!(response && response.data)) {
      throw new HttpException(
        'Internal server error while requesting Rainforest API: response or response.data are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const data = response.data;
    const bestsellers = data.bestsellers;
    return bestsellers;


  }
}

const getGlobalRank = (book): GlobalRank | null => {
  if (!book.bestsellers_rank) return null;

  const { category, rank } = book.bestsellers_rank[0];

  if (!ALLOWED_CATEGORIES_FOR_GLOBAL_RANK.includes(category)) return null;

  return { category, rank };
}

const convertBookFromRainforestApiToBook = (book): BookWithoutCategories => {
  return {
    asin: book.asin,
    authors: book.authors.map(
      ({ name, link }): Author => ({ name, url: link })
    ),
    coverUrl: book.main_image.link,
    title: book.title,
    url: book.link,
    globalRank: getGlobalRank(book),
    hasAPlusContent: book.a_plus_content?.has_a_plus_content,
    rating: {
      value: book.rating,
      number: book.ratings_total
    },
    variants: book.variants?.map(
      ({ asin, title, link, is_current_product }): Variant => ({ asin, type: title, url: link, isCurrent: is_current_product })),
    publicationDate: book.publication_date

  };
}
