import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchBooksDto {
  @IsNotEmpty({ each: true })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: `Il faut au minimum un ASIN` })
  @ArrayMaxSize(10, { message: `Il faut au maximum 10 ASIN` })
  @Length(10, 10, { each: true, message: `L'ASIN doit être de 10 caractères` })
  @Transform(({ value }: { value: string }): string[] => {
    return value.split(' ').map(asin => asin.trim()).filter(asin => !!asin);
  })
  readonly asins: string[];
}
