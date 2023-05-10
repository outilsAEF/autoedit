import { IsNotEmpty, IsString } from 'class-validator';

export class SearchBooksDto {
  @IsNotEmpty()
  @IsString()
  readonly asin: string;
}
