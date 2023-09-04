import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Observable } from 'rxjs';
import { WeatherResponseDTO, WeatherSnippet } from './Weather.dto';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get('weather')
    async getWeather(
        @Query('location') location: string): Promise<WeatherResponseDTO> {
        return this.weatherService.getWeather(location);
    }

    @Get('temperature')
    async getTemperature(
        @Query('location') location: string): Promise<WeatherSnippet> {
        return this.weatherService.getTemperature(location);
    }
}