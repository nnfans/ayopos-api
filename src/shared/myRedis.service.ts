import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import IORedis = require('ioredis');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyRedisService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.client = this.redisService.getClient();
    this.prefixKey = this.configService.get('redis.prefixKey');
  }

  client: IORedis.Redis;
  prefixKey: '';

  // Check if redis client is ready
  isReady(): boolean {
    return this.client.status == 'ready';
  }

  async get(key: IORedis.KeyType): Promise<string> {
    if (!this.isReady()) {
      return null;
    }

    return this.client.get(key);
  }

  async set(
    key: IORedis.KeyType,
    value: IORedis.ValueType,
    expiryMode?: string | any[],
    time?: string | number,
    setMode?: string | number,
  ): Promise<'OK'> {
    const filtered: any[] = [key, value, expiryMode, time, setMode].filter(
      arg => !!arg,
    );

    if (!this.isReady()) {
      return null;
    }

    return this.client.set.call(this.client, filtered);
  }

  async scanMatch(key: string): Promise<string[]> {
    if (!this.isReady()) {
      return null;
    }

    return new Promise((resolve, reject) => {
      // Create redis scanStream
      const stream = this.client.scanStream({
        match: this.prefixKey + key,
        count: 100,
      });

      let found = [];

      stream.on('data', (keys: string[]) => {
        // Merge found data
        found = [...found, ...keys];
      });

      stream.on('end', () => resolve(found));

      stream.on('error', error => reject(error));
    });
  }

  async deleteMatch(key: string): Promise<'OK'> {
    if (!this.isReady()) {
      return null;
    }

    return new Promise((resolve, reject) => {
      // Create redis scanStream
      const stream = this.client.scanStream({
        match: this.prefixKey + key,
        count: 100,
      });

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          // Create new redis pipeline
          const pipeline = this.client.pipeline();

          keys.forEach(val => {
            // Add key for deletion to redis pipeline
            pipeline.del(val.substr(this.prefixKey.length));
          });
          // Execute redis pipeline
          pipeline.exec();
        }
      });

      stream.on('end', () => resolve('OK'));

      stream.on('error', error => reject(error));
    });
  }
}
