import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_MAIN_HOST: string;

  @IsNumber()
  DB_MAIN_PORT: number;

  @IsString()
  DB_MAIN_USER: string;

  @IsString()
  DB_MAIN_PASSWORD: string;

  @IsString()
  DB_MAIN_DATABASE: string;

  @IsBoolean()
  TYPEORM_LOGGING: boolean;

  @IsString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  COOKIE_SECRET: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsNumber()
  REDIS_DB: number;

  @IsString()
  REDIS_USERNAME: string;

  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  REDIS_PREFIX: string;

  @IsString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  JWT_ACCESS_TOKEN_PUBLIC_KEY: string;

  @IsString()
  JWT_ACCESS_TOKEN_PRIVATE_KEY: string;

  @IsString()
  JWT_REFRESH_TOKEN_PUBLIC_KEY: string;

  @IsString()
  JWT_REFRESH_TOKEN_PRIVATE_KEY: string;

  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  STRIPE_CURRENCY: string;

  @IsString()
  FRONTEND_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
