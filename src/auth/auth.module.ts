import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../cache/cache.module';
import { MyLogger } from '../utils/logger';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [CacheModule, JwtModule.register({ global: true })],
  providers: [AuthService, MyLogger],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
