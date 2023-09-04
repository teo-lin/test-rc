import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { WeatherRecord, WeatherResponseDTO, WeatherSnippet } from './Weather.dto';
import { WeatherValidationInterceptor } from './weather-validation.interceptor';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
@UseInterceptors(WeatherValidationInterceptor)
export class WeatherService {
    constructor(
        private readonly httpService: HttpService,
        private readonly redisService: RedisService
    ) { }

    async getWeather(location: string): Promise<WeatherResponseDTO> {
        const apiUrl = `${process.env.WEATHERBIT_URL}current?city=${location},RO&key=${process.env.WEATHERBIT_APIKEY}&include=${process.env.WEATHERBIT_INTERVAL}`;
        const response = await this.httpService.get(apiUrl).toPromise();
        return response.data;
    }

    async getTemperature(location: string): Promise<WeatherSnippet> {
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

        // Fetch the current weather data
        const weather = await this.getWeather(location);

        // Create a new weather snippet
        const weatherSnippet: WeatherSnippet = {
            datetime: weather.data[0].datetime,
            temperature: weather.data[0].app_temp,
        };
        console.log('NEW SNIPPET:', weatherSnippet);

        // Check if the weatherSnippet already exists in the array
        const exists = weatherArray.some((item) =>
            this.compareWeatherSnippets(item, weatherSnippet)
        );

        if (!exists) {
            // Add the current weatherSnippet to the array
            console.log(`Pushing new snippet: ${weatherSnippet}`);
            weatherArray.push(weatherSnippet);

            // Store the updated array in Redis cache
            await this.redisService.set(location, JSON.stringify(weatherArray));
        }

        return weatherSnippet;
    }

    // Helper function to compare weather snippets
    compareWeatherSnippets(a: any, b: any): boolean {
        return a.datetime === b.datetime && a.temperature === b.temperature;
    }
}