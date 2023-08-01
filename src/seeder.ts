import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { Product } from './modules/products/entities/product.entity';
import { CreateProductsSeeder } from './database/seeds/create-products.seed';
import { databaseConfig } from './common/config/database.config';

seeder({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return databaseConfig;
      },
    }),
    TypeOrmModule.forFeature([Product]),
  ],
}).run([CreateProductsSeeder]);
