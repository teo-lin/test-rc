import { Module } from '@nestjs/common';
import { MyRedisService } from '../myredis/myredis.service';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [MyRedisService, HelloService],
})
export class HelloModule { }
