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
        const apiUrl = `${process.env.WEATHERBIT_URL}current?city=${location},RO&key=${process.env.WEATHERBIT_APIKEY}&include=${process.env.WEATHERBIT_INTERVAL}`;
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