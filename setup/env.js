const readline = require('readline')

// GET USER INPUT
async function getUserInput() {
  const obj = {}
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  async function getInput(prompt) {
    return new Promise(resolve => {
      rl.question(prompt, answer => { resolve(answer) })
    })
  }

  try {
    obj.MY_MICROSERVICE_NAME = await getInput('Enter your microservice name: ')
    obj.MY_DATABASE_NAME = await getInput('Enter your database name or leave blank to use the same name as the microservice: ') || obj.MY_MICROSERVICE_NAME
    obj.MY_SUPERUSER_NAME = await getInput('Enter your superuser name or leave blank for default (): ') || ''
    obj.MY_POSTGRES_PASS = await getInput('Enter your Postgres password or leave blank for default ()): ') || ''
    obj.MY_DATA_FOLDER_PATH = await getInput('Enter your data folder path or leave blank for default (C:\\_____\\_CODE\\databases\\test): ') || 'C:\\_____\\_CODE\\databases\\test'
  } finally {
    rl.close()
  }

  return obj
}

// CREATE TEMPLATES FOR CONFIG FILES AND MODS
// !! This is really bad practice, so I've set-up GutGuardian to protect this file,
// but I wouldn't recommend this approach outside demo purposes
async function setupConfigs(obj) {
  obj.FILE_ENV = `
DB_HOST=localhost
DB_PORT=6379
DB_USER=${obj.MY_SUPERUSER_NAME}
DB_PASS=${obj.MY_POSTGRES_PASS}
DB_NAME=${obj.MY_MICROSERVICE_NAME}
WEATHERBIT_ISER=rc
WEATHERBIT_PASS=rc.001
WEATHERBIT_MAIL=api@rankingcoach.com
WEATHERBIT_INTERVAL=minutely
WEATHERBIT_APIKEY=b541d7219b6c468eb87fea42f3c34e9b
WEATHERBIT_URL=https://api.weatherbit.io/v2.0/
`
  obj.FILE_DOCKER = `
# Use the official Node.js 20 image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the application will run on
EXPOSE 3000

# Command to start the application
CMD [ "npm", "run", "start:prod" ]
`
  obj.FILE_DOCKER_COMPOSE = `
version: '3'
services:
  my-microservice:
    build: .
    ports:
      - '3000:3000'
`
  obj.FILE_MAIN = `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
`
  obj.FILE_APP_MODULE = `
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherModule } from './weather/weather.module';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StatsModule } from './stats/stats.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, WeatherModule, StatsModule],
  controllers: [AppController, WeatherController, StatsController],
  providers: [AppService, WeatherService, StatsService],
})
export class AppModule { }
`
  obj.FILE_WEATHER_MODULE = `
  import { Module } from '@nestjs/common';
  import { HttpModule } from '@nestjs/axios';
  import { WeatherService } from './weather.service';
  import { WeatherController } from './weather.controller';
  
  @Module({
      imports: [HttpModule],
      controllers: [WeatherController],
      providers: [WeatherService],
  })
  export class WeatherModule { }  
`
  obj.FILE_WEATHER_SERVICE = `
  import { HttpService } from '@nestjs/axios';
  import { Observable, catchError, map } from 'rxjs';
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class WeatherService {
      constructor(private readonly httpService: HttpService) { }
  
      getTemperature(location: string): Observable<any>/*@TODO any->dto*/ {
          const apiUrl = \`\${process.env.WEATHERBIT_URL}current?city=\${location}&key=\${process.env.WEATHERBIT_APIKEY}&include=\${process.env.WEATHERBIT_INTERVAL}\`;
          console.log(apiUrl);
  
          return this.httpService.get(apiUrl).pipe(
              map(response => {
                  const temperature = response.data.data[0].temp;
                  return { temperature };
              })
          );
      }
  }  
`
  obj.FILE_WEATHER_CONTROLLER = `
  import { Controller, Get, Query } from '@nestjs/common';
  import { WeatherService } from './weather.service';
  import { Observable } from 'rxjs';
  
  @Controller('weather')
  export class WeatherController {
      constructor(private readonly weatherService: WeatherService) { }
  
      @Get('temperature')
      getTemperature(
          @Query('location') location: string): Observable<any>/*@TODO any->dto*/ {
          return this.weatherService.getTemperature(location);
      }
  }  
`
  return obj
}

module.exports = {
  getUserInput,
  setupConfigs
}