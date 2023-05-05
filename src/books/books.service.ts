import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amazonPaapi from 'amazon-paapi';
import { Author, Book, Category } from './entities/book.entity';
import axios from 'axios';

const CATEGORY_NAME_TO_NOT_DISPLAY = ['Catégories'];

const getFullCategory = (node): string => {
  let categoryTree = '';
  if (!node.Ancestor) {
    categoryTree = node.DisplayName;
  } else if (!CATEGORY_NAME_TO_NOT_DISPLAY.includes(node.DisplayName)) {
    categoryTree = getFullCategory(node.Ancestor)
      .concat(' > ')
      .concat(node.DisplayName);
  } else {
    categoryTree = getFullCategory(node.Ancestor);
  }
  return categoryTree;
};

@Injectable()
export class BooksService {
  constructor(private readonly configService: ConfigService) {}
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
        'BrowseNodeInfo.WebsiteSalesRank',
        'Images.Primary.Medium',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Title',
      ],
    };

    const books = await amazonPaapi.GetItems(
      commonParameters,
      requestParameters
    );
    const bookFromPAAPI = books.ItemsResult.Items[0];

    const categories: Category[] =
      bookFromPAAPI.BrowseNodeInfo.BrowseNodes.sort((a, b) => {
        return +b.SalesRank || 0 - +a.SalesRank || 0;
      }).map((node): Category => {
        return {
          title: node.DisplayName,
          url: `https://www.amazon.fr/gp/bestsellers/books/${node.Id}?tag=${partnerTag}`,
          ...(node.SalesRank && { rank: node.SalesRank }),
          categoryTree: getFullCategory(node),
        };
      });

    console.log('Getting extra info from Rain Forest API');
    const bookFromRainforestAPI = await this.getBookFromRainforestAPI(asin);

    const book: Book = {
      asin,
      authors: bookFromRainforestAPI.authors.map(
        (author): Author => author.name
      ),
      // coverUrl: bookFromPAAPI.Images.Primary.Medium.URL,
      coverUrl: bookFromRainforestAPI.main_image.link,
      // title: bookFromPAAPI.ItemInfo.Title.DisplayValue,
      title: bookFromRainforestAPI.title,
      // url: bookFromPAAPI.DetailPageURL,
      url: bookFromRainforestAPI.link,
      categories,
      globalRank: +bookFromRainforestAPI.bestsellers_rank[0].rank,
    };

    return book;
  }

  private async getCategoriesFromRainforestAPI(
    categoriesId: number[]
  ): Promise<Category[]> {
    console.log(
      `getCategoriesFromRainforestAPI with categoriesId ${categoriesId}`
    );
    const categories = await Promise.all(
      categoriesId.map((id) => {
        return this.getCategoryFromRainforestAPI(id);
      })
    );
    return categories.filter(
      (category) => category !== undefined
    ) as Category[];
  }

  private async getCategoryFromRainforestAPI(
    id: number
  ): Promise<Category | undefined> {
    console.log(`getCategoryFromRainforestAPI with categoryId ${id}`);
    const axiosParams = {
      api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
      amazon_domain: 'amazon.fr',
      id,
      type: 'standard',
      // include_fields:
      //   'product.title,product.link,product.authors,product.categories,product.main_image,product.bestsellers_rank',
    };

    let response;
    try {
      response = await axios.get('https://api.rainforestapi.com/categories', {
        params: axiosParams,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Categories API for categoryId ${id}: ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
          );
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        return;
      }
    }

    if (!(response && response.data))
      throw new HttpException(
        'Internal server error while requesting Rainforest API: response or response.data are undefined. Please check your logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const data = response.data;
    const categoryFromRainforestAPI = data.category;
    // console.log('response from axios', bookRainForestAPI);
    console.log(
      `category name ${categoryFromRainforestAPI.name} category full path ${categoryFromRainforestAPI.path}`
    );

    const partnerTag = this.configService.get<string>('PAAPI_PARTNER_TAG');
    return {
      name: categoryFromRainforestAPI.name,
      url: `https://www.amazon.fr/gp/bestsellers/books/${id}?tag=${partnerTag}`,
      // ...(node.SalesRank && { rank: node.SalesRank }),
      categoryTree: categoryFromRainforestAPI.path,
    };
  }

  private async getBookFromRainforestAPI(asin: string) {
    console.log(`getBookFromRainforestAPI with asin ${asin}`);
    const axiosParams = {
      api_key: this.configService.get<string>('RAINFOREST_APIKEY'),
      amazon_domain: 'amazon.fr',
      asin,
      type: 'product',
      include_fields:
        'product.title,product.link,product.authors,product.categories,product.main_image,product.bestsellers_rank',
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
            `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest Product API : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
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
    console.log(
      'kindle ranking',
      bookFromRainforestAPI.bestsellers_rank[0].rank
    );
    return bookFromRainforestAPI;
  }
}
