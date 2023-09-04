import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { WeatherSnippet, WeatherRecord } from '../weather/Weather.dto';
import { RedisService } from 'src/redis/redis.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StatsService {
    private readonly locations: string[];
    constructor(
        private readonly weatherService: WeatherService,
        private readonly redisService: RedisService
    ) {
        // Access the LOCATIONS variable directly from the environment
        this.locations = process.env.LOCATIONS.split(',');
    }

    async getTemperatures(): Promise<WeatherRecord[]> {
        // These should normally come from front-end, gonna hardcode them here for demo
        const locations = ['Deva', 'Carei', 'Arad'];

        const promises: Promise<WeatherRecord>[] = locations.map(
            async (location) => {
                const weatherSnippet: WeatherSnippet = await this.weatherService.getTemperature(location);
                const weatherRecord: WeatherRecord = { ...weatherSnippet, location: location }
                return weatherRecord;
            }
        );

        const results: WeatherRecord[] = await Promise.all(promises);

        return results;
    }

    async addMockRecords(): Promise<void> {
        const currentTimestamp = new Date();
        const interval = 5; // 5 minutes

        for (const location of this.locations) {
            let weatherArray = [];
            for (let i = 0; i < 5; i++) {
                const timestamp = new Date(currentTimestamp.getTime() - i * interval * 60000);
                const temperature = Math.floor(Math.random() * 40) + 1;

                const weatherSnippet = {
                    datetime: timestamp.toISOString().slice(0, 16).replace('T', ':'),
                    temperature,
                };
                weatherArray.push(weatherSnippet);
            }
            // Store the new weatherArray in Redis
            await this.redisService.set(location, JSON.stringify(weatherArray));
        }
    }

    async onModuleInit() {
        // Add mock records on module initialization
        await this.addMockRecords();
        const all = await this.redisService.getAll();
        console.log(all);
    }

    // Schedule the cron job to run every hour
    // onModuleInit() {this.getTemperaturesCron();}

    // @Cron('0 * * * *') // Cron expression for every hour
    // async getTemperaturesCron() {
    //     this.getTemperatures().subscribe(
    //         (temperatures) => { console.log('Fetched temperatures:', temperatures);},
    //         (error) => {console.error('Error fetching temperatures:', error);}
    //     );
    // }
}
