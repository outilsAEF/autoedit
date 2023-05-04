import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amazonPaapi from 'amazon-paapi';
import { Author, Book, Category } from './entities/book.entity';
import axios from 'axios';

const getFullCategory = (node): string => {
  let categoryTree = '';
  if (!node.Ancestor) {
    categoryTree = node.DisplayName;
  } else {
    categoryTree = getFullCategory(node.Ancestor)
      .concat(' > ')
      .concat(node.DisplayName);
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
        console.error(error.response);
        console.error(
          `HTTP Error [status=${error.response.status},statusText="${error.response.statusText}"] while requesting Rainforest API : ${error.response.data.request_info.message}` //request.info_message comes from Rainforest API
        );
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
    const bookFromRainForestAPI = data.product;
    // console.log('response from axios', bookRainForestAPI);
    console.log(
      'kindle ranking',
      bookFromRainForestAPI.bestsellers_rank[0].rank
    );

    const book: Book = {
      asin,
      authors: bookFromRainForestAPI.authors.map(
        (author): Author => author.name
      ),
      // coverUrl: bookFromPAAPI.Images.Primary.Medium.URL,
      coverUrl: bookFromRainForestAPI.main_image.link,
      // title: bookFromPAAPI.ItemInfo.Title.DisplayValue,
      title: bookFromRainForestAPI.title,
      // url: bookFromPAAPI.DetailPageURL,
      url: bookFromRainForestAPI.link,
      categories,
      globalRank: +bookFromRainForestAPI.bestsellers_rank[0].rank,
    };

    return book;
  }
}
