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