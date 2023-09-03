import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';
import { HttpModule } from '@nestjs/axios';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HelloModule } from './hello/hello.module';
import { MyRedisService } from './myredis/myredis.service';

// @TODO: coalesce all imports
@Module({
  imports: [HttpModule, WeatherModule, StatsModule, HelloModule],
  controllers: [AppController, WeatherController, StatsController],
  providers: [AppService, WeatherService, StatsService, MyRedisService],
})
export class AppModule { }