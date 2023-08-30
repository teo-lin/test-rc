import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Observable } from 'rxjs';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('temperatures')
    getTemperatures(): Observable<any> {
        return this.statsService.getTemperatures();
    }
}
