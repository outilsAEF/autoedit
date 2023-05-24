import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SearchBooksDto {
  @IsNotEmpty({ each: true })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Transform(({ value }: { value: string }): string[] => {
    console.log('asins is', value);

    return value.split(' ').map(asin => asin.trim()).filter(asin => !!asin);
  })
  readonly asins: string[];
}
