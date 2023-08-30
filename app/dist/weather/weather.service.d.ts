import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
export declare class WeatherService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getTemperature(location: string): Observable<any>;
}
