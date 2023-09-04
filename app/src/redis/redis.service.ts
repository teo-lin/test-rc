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

    async getAll(): Promise<{ [key: string]: string }[]> {
        const keys = await this.client.keys('*'); // '*' retrieves all keys
        const records: { [key: string]: string }[] = [];

        for (const key of keys) {
            const value = await this.client.get(key);
            records.push({ [key]: value });
        }

        return records;
    }
}