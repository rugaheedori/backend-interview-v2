import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    const redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      retryStrategy: (): number => {
        console.error('auth Redis connection interruption');
        console.error('Retrying');
        return this.configService.get<number>('REDIS_TIMEOUT'); // ms
      },
    });

    this.redisClient = redis;
  }
}
