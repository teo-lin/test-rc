import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemperaturesDTO } from './Stats.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StatsService {
    constructor(private readonly weatherService: WeatherService) { }

    async getTemperatures(): Promise<TemperaturesDTO> {
        const locations = ['Deva', 'Carei', 'Arad'];

        const promises: Promise<{ location: string; temperature: number }>[] = locations.map(
            async (location) => {
                const temperature = await this.weatherService.getTemperature(location);
                return { location, temperature };
            }
        );

        const results = await Promise.all(promises);

        const result: TemperaturesDTO = {};
        results.forEach(({ location, temperature }) => {
            result[location] = temperature;
        });

        return result;
    }

    // onModuleInit() {
    //     // Schedule the cron job to run every hour
    //     this.getTemperaturesCron();
    // }

    // @Cron('0 * * * *') // Cron expression for every hour
    // async getTemperaturesCron() {
    //     this.getTemperatures().subscribe(
    //         (temperatures) => {
    //             // @TODO: save to redis later
    //             console.log('Fetched temperatures:', temperatures);
    //         },
    //         (error) => {
    //             console.error('Error fetching temperatures:', error);
    //         }
    //     );
    // }
}
