import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import redisConfig from './redis.config';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis(redisConfig);
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }
}