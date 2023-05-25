import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InvalidASINException } from 'src/books/books.exceptions';
import { Category } from 'src/books/entities/book.entity';
import amazonPaapi from 'amazon-paapi';
import { ConfigService } from '@nestjs/config';


const CATEGORY_NODE_NAME_TO_NOT_DISPLAY = ['Catégories', 'Boutique Kindle', 'Thèmes'];



@Injectable()
export class AmazonPaapiService {
  constructor(private readonly configService: ConfigService) { }

  async findCategoriesByAsinsWithSalesRank(asins: string[]): Promise<{ categories: Category[], asinsWithErrors?: string[] }> {
    return this.findCategoriesByAsins(asins, true);
  }
  async findCategoriesByAsinsWithoutSalesRank(asins: string[]): Promise<{ categories: Category[], asinsWithErrors?: string[] }> {
    return this.findCategoriesByAsins(asins, false);
  }

  private async findCategoriesByAsins(asins: string[], withSalesRank: boolean): Promise<{ categories: Category[], asinsWithErrors?: string[] }> {
    console.log({ asins })
    const partnerTag = this.configService.get<string>('PAAPI_PARTNER_TAG');
    const commonParameters = {
      AccessKey: this.configService.get<string>('PAAPI_ACCESS_KEY'),
      SecretKey: this.configService.get<string>('PAAPI_SECRET_KEY'),
      PartnerTag: partnerTag,
      PartnerType: this.configService.get<string>('PAAPI_PARTNER_TYPE'),
      Marketplace: this.configService.get<string>('PAAPI_MARKETPLACE'),
    };

    const apiResources = ['BrowseNodeInfo.BrowseNodes',
      'BrowseNodeInfo.BrowseNodes.Ancestor'];
    if (withSalesRank) apiResources.push('BrowseNodeInfo.BrowseNodes.SalesRank');

    const requestParameters = {
      ItemIds: asins,
      IdemIdType: 'ASIN',
      Resources: apiResources
    };


    let books;
    let asinsWithErrors: string[] | undefined;
    try {
      books = await amazonPaapi.GetItems(commonParameters, requestParameters);
      const errorNodes = books.Errors;
      if (errorNodes && errorNodes.length > 0) {
        asinsWithErrors = errorNodes.map(extractAsinFromError);
      }
    } catch (error) {
      if (!error.response) throw new InternalServerErrorException('Could not connect to third party API');

      console.error(
        'Error while getting results from Amazon:',
        error.response.body.Errors
      );
      const errorNodes = error.response.body.Errors;
      if (errorNodes && errorNodes.length > 0) {
        asinsWithErrors = errorNodes.map(extractAsinFromError);
      }
      // if (error.response.body.Errors[0].Code === 'InvalidParameterValue')
      //   throw new InvalidASINException(error.response.body.Errors[0].Message, asins[0]);
    }

    const booksFromPAAPI =
      books.ItemsResult.Items

    const categoryNodes = booksFromPAAPI.map(book => book.BrowseNodeInfo.BrowseNodes).flat();

    const categories: Category[] =
      categoryNodes.map((node) => getCategories(node, partnerTag));

    return { categories, asinsWithErrors };

  }
}

const ASIN_POSITION_IN_ERROR_MESSAGE_FROM_AMAZON_PAAPI = 3
const extractAsinFromError = (errorNode): string => {
  const msg = errorNode.Message;
  console.log('extractAsinFromError', msg);
  const asin = msg.split(' ')[ASIN_POSITION_IN_ERROR_MESSAGE_FROM_AMAZON_PAAPI - 1];
  console.log('extractAsinFromError', asin);
  return asin;
}



const getCategories = (node, partnerTag): Category =>
({
  id: node.Id,
  title: node.DisplayName,
  url: `https://www.amazon.fr/gp/bestsellers/books/${node.Id}?tag=${partnerTag}`,
  ...(node.SalesRank && { rank: node.SalesRank }),
  categoryTree: getFullCategory(node).slice(0, -1 * CATEGORY_TREE_SEPARATOR.length),
})


const CATEGORY_TREE_SEPARATOR = ' > ';

const getFullCategory = (node): string => {
  let categoryTree = '';
  if (categoryIsRoot(node)) {
    if (displayNameCanBeIncluded(node)) {
      categoryTree = node.DisplayName.concat(CATEGORY_TREE_SEPARATOR);
    }
  } else if (displayNameCanBeIncluded(node)) {
    categoryTree = getFullCategory(node.Ancestor)
      .concat(node.DisplayName)
      .concat(CATEGORY_TREE_SEPARATOR)
  } else {
    categoryTree = getFullCategory(node.Ancestor);
  }
  return categoryTree;
};

const categoryIsRoot = (node) => !node.Ancestor;
const displayNameCanBeIncluded = (node) => !CATEGORY_NODE_NAME_TO_NOT_DISPLAY.includes(node.DisplayName)


