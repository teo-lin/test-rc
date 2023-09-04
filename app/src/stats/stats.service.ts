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
        // Normally this should come from front-end, I'll just hardcode it for the demo
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

    async getAverage(location): Promise<number> {
        // Get the cache for the location
        const cachedData = await this.redisService.get(location);
        let weatherArray: WeatherSnippet[] = [];

        if (cachedData) {
            // Parse the cached data as JSON
            try {
                weatherArray = JSON.parse(cachedData);
            } catch (error) {
                console.error('Error parsing cached data:', error);
            }
        }
        console.log('CACHED:', location, weatherArray);

        // Get the average temperature
        let averageTemperature;
        const currentTemperature = (await this.weatherService.getTemperature(location)).temperature;

        const totalTemperature = weatherArray.reduce((sum, element) => sum + element.temperature, 0);
        totalTemperature === 0 ? averageTemperature = currentTemperature : averageTemperature = (totalTemperature + currentTemperature) / (weatherArray.length + 1);

        return averageTemperature;
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

        // Schedule the cron job to run every hour. Api limits depleted imediately with this, hard to test
        // this.getTemperaturesCron();
    }

    // Cron disabled, as it depletes the 50 calls very fast
    // @Cron('0 * * * *') // Cron expression for every hour 
    // async getTemperaturesCron() {
    //     this.getTemperatures().subscribe(
    //         (temperatures) => { console.log('Fetched temperatures:', temperatures); },
    //         (error) => { console.error('Error fetching temperatures:', error); }
    //     );
    // }
}
