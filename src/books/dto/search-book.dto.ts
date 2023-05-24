import { IsNotEmpty, IsString } from 'class-validator';

export class SearchBookDto {
  @IsNotEmpty()
  @IsString()
  readonly asin: string;
}
