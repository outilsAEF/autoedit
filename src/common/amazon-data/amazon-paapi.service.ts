import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InvalidASINException } from 'src/books/books.exceptions';
import { Category } from 'src/books/entities/book.entity';
import amazonPaapi from 'amazon-paapi';
import { ConfigService } from '@nestjs/config';


const CATEGORY_NODE_NAME_TO_NOT_DISPLAY = ['Catégories', 'Boutique Kindle', 'Thèmes'];
const CATEGORY_TREE_TO_NOT_SHOW_CONTAINS = 'Self Service';


@Injectable()
export class AmazonPaapiService {
  constructor(private readonly configService: ConfigService) { }

  async findCategoriesByAsin(asin: string): Promise<Category[]> {

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

    if (!books.ItemsResult) { throw new InvalidASINException('', asin) }

    const bookFromPAAPI = books.ItemsResult.Items[0];

    const categoriesNotFiltered: Category[] =
      bookFromPAAPI.BrowseNodeInfo.BrowseNodes
        .sort(sortCategories)
        .map((node) => getCategories(node, partnerTag));

    const categories = filterCategories(categoriesNotFiltered);

    return categories

  }
}

const sortCategories = (nodeA, nodeB) => {
  return +nodeB.SalesRank || 0 - +nodeA.SalesRank || 0;
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

const filterCategories = (categories: Category[]): Category[] => {
  return categories.filter(
    (category) =>
      !category.categoryTree.includes(CATEGORY_TREE_TO_NOT_SHOW_CONTAINS)
  );
};
