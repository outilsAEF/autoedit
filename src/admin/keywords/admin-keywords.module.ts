import { Module } from '@nestjs/common';
import { AdminKeywordsController } from './admin-keywords.controller';
import { KeywordsController } from './keywords.controller';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';

@Module({
  controllers: [AdminKeywordsController, KeywordsController],
  providers: [RainforestApiService]
})
export class AdminKeywordsModule { }
