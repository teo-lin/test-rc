import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { MyRedisService } from 'src/myredis/myredis.service';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, MyRedisService],
  exports: [WeatherService],
})
export class WeatherModule { }