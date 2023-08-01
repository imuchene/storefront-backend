import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';
import { Logger } from '@nestjs/common';

export const dataSource = new DataSource(databaseConfig);

dataSource
  .initialize()
  .then(() => {
    Logger.log('Data source has been initialized');
  })
  .catch((error) => {
    Logger.error('Error during data source initialization', error);
  });
