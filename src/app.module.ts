import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { DbModule } from './db/db.module';
import { LikeModule } from './like/like.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { MyLogger } from './utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    CacheModule,
    AccountModule,
    AuthModule,
    ProductModule,
    LikeModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule {}
