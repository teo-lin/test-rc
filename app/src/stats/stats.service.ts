import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class StatsService {
    constructor(private readonly weatherService: WeatherService) { }

    getTemperatures(): Observable<any> {
        const locations = ['Deva', 'Carei', 'Arad']; // Modify as needed

        type temmperature = {
            temperature: number
        }

        const stats: temmperature[] = locations.map(location =>
            this.weatherService.getTemperature(location)
        );

        console.log(stats);

        return forkJoin(stats).pipe(
            map(responses => {
                const temperatures = responses.map(response => {
                    if (response && response.data && response.data.data[0]) {
                        return response.data.data[0].temp;
                    }
                    return null; // Return null for invalid responses
                });

                const formattedData = locations.reduce((acc, location, index) => {
                    acc[location] = temperatures[index];
                    return acc;
                }, {});

                return formattedData;
            })
        );
    }
}
