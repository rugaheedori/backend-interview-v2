import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import { DbModule } from './db/db.module';
import { MyLogger } from './utils/logger';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, CacheModule, AccountModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, MyLogger],
})
export class AppModule {}
