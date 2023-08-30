import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Observable } from 'rxjs';
import { WeatherResponseDTO } from './Weather.dto';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get('weather')
    getWeather(
        @Query('location') location: string): Observable<WeatherResponseDTO> {
        return this.weatherService.getWeather(location);
    }

    @Get('temperature')
    getTemperature(
        @Query('location') location: string): Observable<number> {
        return this.weatherService.getTemperature(location);
    }
}