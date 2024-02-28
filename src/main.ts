import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    credentials: true,
  });
  const port = configService.get('PORT');
  app.use(helmet());
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.use(bodyParser.json({ limit: '50kb'}));
  app.use(bodyParser.urlencoded({ extended: true }));
  // For a high traffic website in production, it's recommended to instead offload
  // compression from the application server to a web server e.g Nginx
  app.use(compression());
  await app.listen(port);
}
bootstrap();
