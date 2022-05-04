import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersModule } from '../customers/customers.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import * as fs from 'fs';

@Module({
  imports: [
    CustomersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: fs
          .readFileSync(
            configService.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
          )
          .toString(),
        publicKey: fs
          .readFileSync(
            configService.get<string>('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
          )
          .toString(),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
          algorithm: 'RS256',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
