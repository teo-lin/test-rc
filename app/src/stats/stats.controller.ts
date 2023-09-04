import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { WeatherRecord } from '../weather/Weather.dto';
import { Observable } from 'rxjs';
import { TemperaturesDTO } from './Stats.dto';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('temperatures')
    async getTemperatures(): Promise<WeatherRecord[]> {
        return this.statsService.getTemperatures();
    }

    @Get('average')
    async getAverage(
        @Query('location') location: string): Promise<number> {
        return this.statsService.getAverage('Deva');
    }
}
