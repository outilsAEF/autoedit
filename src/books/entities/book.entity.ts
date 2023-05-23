export type Author = {
  name: string,
  url: string
};

export type Rating = {
  value: number,
  number: number
}

export type Variant = {
  asin: string;
  url: string;
  type: string;
  isCurrent: boolean

}

export type Category = {
  id: number;
  name?: string;
  title?: string;
  categoryTree: string;
  rank?: number;
  url: string;
};

export type Book = {
  asin: string;
  title: string;
  url: string;
  authors: Author[];
  coverUrl: string;
  categories: Category[];
  globalRank: GlobalRank | null;
  hasAPlusContent: boolean;
  rating: Rating;
  variants: Variant[];
  publicationDate: string;
}

export type BookWithoutCategories = Omit<Book, "categories">;

export type Bestseller = {
  asin: string,
  position: string,
  title: string
}

export type Top = {
  position: string,
  topRanking: number | undefined
}

export type GlobalRank = {
  category: string,
  rank: number
}
