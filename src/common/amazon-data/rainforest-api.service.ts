import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { Author, BookWithoutCategories, Variant } from 'src/books/entities/book.entity';
setupCache(axios, { ttl: 1000 * 60 * 60 * 4 }); // 4 hours



@Injectable()
export class RainforestApiService {
  private defaultApiParams: Record<string, string> = {
    api_key: '',
    amazon_domain: 'amazon.fr',
  };

  constructor(private readonly configService: ConfigService) {
    this.defaultApiParams.api_key = this.configService.get<string>('RAINFOREST_APIKEY') as string;

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

  async findKindleRankingByAsin(asin: string): Promise<number | undefined> {
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

    const rank = bookFromRainforestAPI.bestsellers_rank ? bookFromRainforestAPI.bestsellers_rank[0].rank : undefined;

    return rank;
  }
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
    globalRank: (book.bestsellers_rank && book.bestsellers_rank[0]?.rank) || undefined,
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
