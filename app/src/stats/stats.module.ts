import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { WeatherModule } from 'src/weather/weather.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
    imports: [ScheduleModule.forRoot(),
        WeatherModule],
    controllers: [StatsController],
    providers: [StatsService, RedisService],
})
export class StatsModule { }
