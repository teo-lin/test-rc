import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Observable } from 'rxjs';
import { TemperaturesDTO } from './Stats.dto';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('temperatures')
    getTemperatures(): Observable<TemperaturesDTO> {
        return this.statsService.getTemperatures();
    }
}
