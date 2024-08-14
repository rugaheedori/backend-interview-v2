import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { MyLogger } from '../utils/logger';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { LikeService } from './like.service';

@Module({
  imports: [DbModule],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, MyLogger],
})
export class LikeModule {}
