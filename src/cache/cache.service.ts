import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';

@Injectable()
export class CacheService {
  private redisClient: Redis;

  constructor(private configService: ConfigService, private logger: MyLogger) {
    const redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      retryStrategy: (): number => {
        this.logger.warn('auth Redis connection interruption');
        this.logger.warn('Retrying');
        return Number(this.configService.get<number>('REDIS_TIMEOUT')); // ms
      },
    });

    this.redisClient = redis;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.setex(key, ttl, JSON.stringify(value)); // sec
      } else {
        await this.redisClient.set(key, JSON.stringify(value));
      }
    } catch (err) {
      this.logger.error(`set: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async get(key: string): Promise<string> {
    try {
      const data = await this.redisClient.get(key);

      return JSON.parse(data);
    } catch (err) {
      this.logger.error(`get: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
