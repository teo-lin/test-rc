import { RedisOptions } from 'ioredis';

const redisConfig: RedisOptions = {
    host: 'redis-container',
    port: 6379,
};

export default redisConfig;