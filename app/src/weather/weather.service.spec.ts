import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let httpService: HttpService;

  const mockHttpService = {
    get: () => of({ data: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(weatherService).to.be.instanceOf(WeatherService);
  });

  describe('getWeather', () => {
    it('should return weather data', async () => {
      const weatherData = {}; // Mock your weather response data
      const location = 'SomeLocation';

      mockHttpService.get = () => of({ data: weatherData });

      const result = await weatherService.getWeather(location).toPromise();

      expect(result).to.deep.equal(weatherData);
    });
  });

  describe('getTemperature', () => {
    it('should return temperature', async () => {
      const weatherData = {
        data: [
          {
            app_temp: 25, // Mock temperature value
          },
        ],
      };

      const location = 'SomeLocation';

      mockHttpService.get = () => of({ data: weatherData });

      const result = await weatherService.getTemperature(location).toPromise();

      expect(result).to.equal(25);
    });
  });
});
