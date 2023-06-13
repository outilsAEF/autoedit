import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchVolumeService {
  async findByKeyword(keyword: string): Promise<number> {
    // console.log('SearchVolumeService - find by keyword: ', keyword);

    return -1;
  }
}
