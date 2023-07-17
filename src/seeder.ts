import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { Product } from './modules/products/entities/product.entity';
import { CreateProductsSeeder } from './database/seeds/create-products.seed';
import { validate } from './common/config/env.validation';
import dbConfig from './common/config/db.config';
import redisConfig from './common/config/redis.config';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, redisConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
  ],
}).run([CreateProductsSeeder]);
