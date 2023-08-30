import { expect } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service'; // Import your WeatherService
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService; // Declare the WeatherService

  const mockHttpService = {
    get: () => of({ data: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        WeatherService, // Provide the WeatherService here
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService); // Get the WeatherService instance
  });

  it('should be defined', () => {
    expect(weatherController).to.be.instanceOf(WeatherController);
  });

  // Add more tests for WeatherController if needed
});
