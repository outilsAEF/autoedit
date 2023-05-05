export type Author = string;

export type Category = {
  name?: string;
  title?: string;
  categoryTree: string;
  rank?: number;
  url: string;
};

export class Book {
  asin: string;
  title: string;
  url: string;
  authors: Author[];
  coverUrl: string;
  categories: Category[];
  globalRank: number;
}
