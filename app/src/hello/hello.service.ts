import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HelloService {
    constructor(private readonly myRedisService: RedisService) { }

    async setWho(name: string): Promise<void> {
        const timestamp = new Date().toISOString();
        const data = `${name} - ${timestamp}`;
        await this.myRedisService.set('who', data);
    }

    async getWho(): Promise<string | null> {
        const cachedData = await this.myRedisService.get('who');
        if (cachedData) {
            const [who,] = cachedData.split(' - ');
            return who;
        } else {
            return null;
        }
    }
}
