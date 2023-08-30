import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
    constructor(private readonly httpService: HttpService) { }

    getTemperature(location: string): Observable<any>/*@TODO any->dto*/ {
        const apiUrl = `${process.env.WEATHERBIT_URL}current?city=${location},RO&key=${process.env.WEATHERBIT_APIKEY}&include=${process.env.WEATHERBIT_INTERVAL}`;
        console.log(apiUrl);

        return this.httpService.get(apiUrl).pipe(
            map(response => {
                const temperature = response.data.data[0].temp;
                return { temperature };
            })
        );
    }
}