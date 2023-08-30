import { WeatherService } from './weather.service';
import { Observable } from 'rxjs';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getTemperature(location: string): Observable<any>;
}
