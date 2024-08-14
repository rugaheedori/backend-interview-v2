import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { MyLogger } from '../utils/logger';

@Module({
  providers: [CacheService, MyLogger],
  exports: [CacheService],
})
export class CacheModule {}
