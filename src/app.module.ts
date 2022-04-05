import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './common/config/db.config';
import { validate } from './common/config/env.validation';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({...configService.get('database')}),
      inject: [ConfigService],
    }),
    OrdersModule,
    ProductsModule,
    CustomersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
