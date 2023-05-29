import { Module } from '@nestjs/common';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService, RainforestApiService]
})
export class KeywordsModule { }
