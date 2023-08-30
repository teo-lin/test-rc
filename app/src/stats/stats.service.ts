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
