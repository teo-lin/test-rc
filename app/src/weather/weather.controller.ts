import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Observable } from 'rxjs';
import { WeatherResponseDTO } from './Weather.dto';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get('weather')
    async getWeather(
        @Query('location') location: string): Promise<Observable<WeatherResponseDTO>> {
        return this.weatherService.getWeather(location);
    }

    @Get('temperature')
    async getTemperature(
        @Query('location') location: string): Promise<Observable<number>> {
        return this.weatherService.getTemperature(location);
    }
}