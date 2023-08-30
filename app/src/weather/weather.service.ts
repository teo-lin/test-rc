import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { WeatherResponseDTO } from './Weather.dto';


@Injectable()
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