import { Controller, Get, Query } from '@nestjs/common';
  import { WeatherService } from './weather.service';
  import { Observable } from 'rxjs';
  
  @Controller('weather')
  export class WeatherController {
      constructor(private readonly weatherService: WeatherService) { }
  
      @Get('temperature')
      getTemperature(
          @Query('location') location: string): Observable<any>/*@TODO any->dto*/ {
          return this.weatherService.getTemperature(location);
      }
  }