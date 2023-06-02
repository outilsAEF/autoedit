import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchBookDto {
  @IsNotEmpty({ message: `L'ASIN ne doit pas être vide` })
  @IsString()
  @Length(10, 10, { message: `L'ASIN doit être de 10 caractères` })
  readonly asin: string;
}
