import { DataSourceOptions, LogLevel, LoggerOptions } from 'typeorm';
import 'dotenv/config';

const logLevel: LogLevel = 'error';
const loggerOptions: LoggerOptions = [logLevel];

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  logging: loggerOptions,
  host: process.env.DB_MAIN_HOST,
  port: parseInt(process.env.DB_MAIN_PORT),
  username: process.env.DB_MAIN_USER,
  password: process.env.DB_MAIN_PASSWORD,
  database: process.env.DB_MAIN_DATABASE,
  migrationsRun: Boolean(process.env.TYPEORM_MIGRATIONS_RUN),
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    baseFolder() + 'modules/**/*.entity{.ts,.js}',
    baseFolder() + 'modules/**/*.view{.ts,.js}',
  ],
  migrations: [baseFolder() + 'migrations/**/*{.ts,.js}'],
};

function baseFolder(): string {
  const regex = /common+(\/|\\)+config/gi;
  return __dirname.replace(regex, '');
}
