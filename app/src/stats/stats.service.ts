import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemperaturesDTO } from './Stats.dto';

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
}
