import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [RedisService, HelloService],
})
export class HelloModule { }
