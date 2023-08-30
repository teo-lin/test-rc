import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
    imports: [ScheduleModule.forRoot(),
        WeatherModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule { }
