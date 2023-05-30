import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

export class SearchKeywordsDto {
  @IsArray()
  @ArrayMinSize(1, { message: `Il faut au minimum un mot-clé` })
  @Transform(({ value }: { value: string }): string[] => {
    console.log({ value });
    const returned = value.split("\n").map(keyword => keyword.trim()).filter(keyword => !!keyword);
    console.log({ returned })
    return returned;
  })
  readonly keywords: string[];
}