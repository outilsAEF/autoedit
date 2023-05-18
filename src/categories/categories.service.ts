import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
// import { setupCache } from 'axios-cache-interceptor';
// // setupCache(axios, { ttl: 1000 * 60 * 60 * 8 }); // 4 hours

@Injectable()
export class CategoriesService {
  constructor(private readonly configService: ConfigService) { }
  async findBestSellersByCategoryId(categoryId: number): Promise<void> {
    console.log('CategoriesService with ids', categoryId);

    const axiosParams = {
      api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
      amazon_domain: 'amazon.fr',
      category_id: `bestsellers_${categoryId}`,
      type: 'bestsellers',
      include_fields: 'bestsellers.title,bestsellers.asin'
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
