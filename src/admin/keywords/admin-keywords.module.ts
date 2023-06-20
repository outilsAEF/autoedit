import { Module } from '@nestjs/common';
import { AdminKeywordsController } from './admin-keywords.controller';
import { KeywordsController } from './keywords.controller';
import { RainforestApiService } from 'src/common/amazon-data/rainforest-api.service';
import { DataforseoApiService } from 'src/common/amazon-data/dataforseo-api/dataforseo-api.service';


@Module({
  controllers: [AdminKeywordsController, KeywordsController],
  providers: [RainforestApiService, DataforseoApiService]
})
export class AdminKeywordsModule { }
