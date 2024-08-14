import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../cache/cache.module';
import { MyLogger } from '../utils/logger';
import { AuthService } from './auth.service';

@Module({
  imports: [CacheModule, JwtModule.register({ global: true })],
  providers: [AuthService, MyLogger],
  exports: [AuthService],
})
export class AuthModule {}
