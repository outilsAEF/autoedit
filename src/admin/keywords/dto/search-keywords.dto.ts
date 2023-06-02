import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

export class SearchKeywordsDto {
  @IsArray()
  @ArrayMinSize(1, { message: `Il faut au minimum un mot-clé` })
  @Transform(({ value }: { value: string }): string[] => {
    return value.split("\n").map(keyword => keyword.trim()).filter(keyword => !!keyword);
  })
  readonly keywords: string[];
}