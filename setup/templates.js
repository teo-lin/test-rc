async function insertTemplates(obj) {
  obj.FILE_MAIN = `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
`
  obj.FILE_APP_MODULE = `
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

// @TODO: coalesce all imports
@Module({
  imports: [HttpModule, WeatherModule, StatsModule],
  controllers: [AppController, WeatherController, StatsController],
  providers: [AppService, WeatherService, StatsService],
})
export class AppModule { }
`
  obj.STATS_CONTROLLER = `
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Observable } from 'rxjs';
import { TemperaturesDTO } from './Stats.dto';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('temperatures')
    getTemperatures(): Observable<TemperaturesDTO> {
        return this.statsService.getTemperatures();
    }
}
`
  obj.STATS_DTO = `
export interface TemperaturesDTO {
    [location: string]: number;
}
`
  obj.STATS_MODULE = `
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
`
  obj.STATS_SERVICE = `
import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemperaturesDTO } from './Stats.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StatsService {
    constructor(private readonly weatherService: WeatherService) { }

    getTemperatures(): Observable<TemperaturesDTO> {
        const locations = ['Deva', 'Carei', 'Arad'];

        const observables: Observable<{ location: string; temperature: number }>[] = locations.map(location =>
            this.weatherService.getTemperature(location).pipe(
                map(temperature => ({ location, temperature }))
            )
        );

        return forkJoin(observables).pipe(
            map(temperatures => {
                const result: TemperaturesDTO = {};
                temperatures.forEach(({ location, temperature }) => {
                    result[location] = temperature;
                });
                return result;
            })
        );
    }

    // onModuleInit() {
    //     // Schedule the cron job to run every hour
    //     this.getTemperaturesCron();
    // }

    @Cron('0 * * * *') // Cron expression for every hour
    getTemperaturesCron() {
        this.getTemperatures().subscribe(
            (temperatures) => {
                // @TODO: save to redis later
                console.log('Fetched temperatures:', temperatures);
            },
            (error) => {
                console.error('Error fetching temperatures:', error);
            }
        );
    }
}
`
  obj.WEATHER_INTERCEPTOR = `
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Joi from '@hapi/joi';

@Injectable()
export class WeatherValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const validationResult = weatherValidationSchema.validate(request.query);

        if (validationResult.error) {
            throw new BadRequestException(validationResult.error.message);
        }

        return next.handle();
    }
}

const weatherValidationSchema = Joi.object({
    location: Joi.string().required(),
});
`
  obj.WEATHER_SCHEMA = `
import Joi from '@hapi/joi';

export const weatherValidationSchema = Joi.object({
    location: Joi.string().required(),
});
`
  obj.WEATHER_CONTROLLER = `
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
`
  obj.WEATHER_DTO = `
  export class WeatherResponseDTO {
    count: number;
    data: WeatherDataDTO[];
}

export class WeatherDataDTO {
    app_temp: number;
    aqi: number;
    city_name: string;
    clouds: number;
    country_code: string;
    datetime: string;
    dewpt: number;
    dhi: number;
    dni: number;
    elev_angle: number;
    ghi: number;
    gust: number;
    h_angle: number;
    lat: number;
    lon: number;
    ob_time: string;
    pod: string;
    precip: number;
    pres: number;
    rh: number;
    slp: number;
    snow: number;
    solar_rad: number;
    sources: string[];
    state_code: string;
    station: string;
    sunrise: string;
    sunset: string;
    temp: number;
    timezone: string;
    ts: number;
    uv: number;
    vis: number;
    weather: WeatherInfoDTO;
    wind_cdir: string;
    wind_cdir_full: string;
    wind_dir: number;
    wind_spd: number;
}

export class WeatherInfoDTO {
    code: number;
    icon: string;
    description: string;
}
`
  obj.WEATHER_MODULE = `
  import { Module } from '@nestjs/common';
  import { HttpModule } from '@nestjs/axios';
  import { WeatherService } from './weather.service';
  import { WeatherController } from './weather.controller';
  
  @Module({
    imports: [HttpModule],
    controllers: [WeatherController],
    providers: [WeatherService],
    exports: [WeatherService],
  })
  export class WeatherModule { }
`
  obj.WEATHER_SERVICE = `
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { WeatherResponseDTO } from './Weather.dto';
import { WeatherValidationInterceptor } from './weather-validation.interceptor';

@Injectable()
@UseInterceptors(WeatherValidationInterceptor)
export class WeatherService {
    constructor(private readonly httpService: HttpService) { }

    getWeather(location: string): Observable<WeatherResponseDTO> {
        const apiUrl = \`\${process.env.WEATHERBIT_URL}current?city=\${location},RO&key=\${process.env.WEATHERBIT_APIKEY}&include=\${process.env.WEATHERBIT_INTERVAL}\`;
        const apiRes = this.httpService.get(apiUrl).pipe(
            map(response => response.data as WeatherResponseDTO)
        );

        return apiRes;
    }

    getTemperature(location: string): Observable<number> {
        return this.getWeather(location).pipe(
            map(weather => weather.data[0].app_temp)
        );
    }
}
`

  return obj
}

module.exports = insertTemplates