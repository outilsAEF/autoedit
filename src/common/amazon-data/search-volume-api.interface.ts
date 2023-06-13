export type SearchVolume = {
  keyword: string;
  volume: number | null;

}

export interface SearchVolumeApi<T> {

  getSearchVolumeForKeywords(keywords: string[]): Promise<SearchVolume[]>;

  transformIntoSearchVolumes(items: T[]): SearchVolume[];
}
