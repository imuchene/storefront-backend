import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  await app.listen(port);
}
bootstrap();
