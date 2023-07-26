import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    credentials: true,
  });
  const port = configService.get('PORT');
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  await app.listen(port);
}
bootstrap();
