import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DataforseoKeywordSearchVolume } from './dataforseo-types';
import { SearchVolume, SearchVolumeApi } from '../search-volume-api.interface';

@Injectable()
export class DataforseoApiService implements SearchVolumeApi<DataforseoKeywordSearchVolume> {
  constructor(private readonly configService: ConfigService) { }


  async getSearchVolumeForKeywords(keywords: string[]): Promise<SearchVolume[]> {
    const axiosBody = JSON.stringify([{
      keywords,
      location_code: 2250,
      language_code: 'fr'
    }])

    const dataForSEOApiLogin = this.configService.get('DATAFORSEO_API_LOGIN')
    const dataForSEOApiPassword = this.configService.get('DATAFORSEO_API_PASSWORD');

    const dataForSEOToken = Buffer.from(`${dataForSEOApiLogin}:${dataForSEOApiPassword}`).toString('base64');

    const config = {
      headers: {
        'Authorization': `Basic ${dataForSEOToken}`
      }
    }

    let response;
    try {
      response = await axios.post('https://api.dataforseo.com/v3/dataforseo_labs/amazon/bulk_search_volume/live', axiosBody, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Data for SEO API  : ${error.response.data.status_message}` //request.info_message comes from Rainforest API
          );
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        throw new HttpException(
          'Internal server error while requesting Data for SEO API, please check your logs',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    if (!(response && response.data))
      throw new HttpException(
        'Internal server error while requesting Data for SEO API: response or response.data are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const data = response.data;

    if (!data.tasks || !data.tasks[0].result || !data.tasks[0].result[0].items)
      throw new HttpException(
        'Internal server error while requesting Data for SEO API: data.tasks or data.tasks.result or data.tasks.result.items are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const searchVolumesFromApi: DataforseoKeywordSearchVolume[] = data.tasks[0].result[0].items;

    return this.transformIntoSearchVolumes(searchVolumesFromApi);

  }

  transformIntoSearchVolumes(items: DataforseoKeywordSearchVolume[]): SearchVolume[] {
    return items.map(item => ({ volume: item.search_volume, keyword: item.keyword }));
  }

}

