import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { SecretData } from '../interfaces/secret-data.interface';
import { AuthService } from '../auth.service';
import { Customer } from '../../customers/entities/customer.entity';
import * as util from 'util';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data: SecretData = request?.signedCookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.jwtRefreshToken;
        },
      ]),
    });
  }

  async validate(req: Request, payload: JwtTokenPayload): Promise<Customer> {
    if (!payload) {
      throw new BadRequestException('no token payload');
    }
    const data: SecretData = req?.signedCookies['auth-cookie'];

    if (!data.jwtRefreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    const customer = await this.authService.validateRefreshToken(
      payload.customerId,
      data.jwtRefreshToken,
      data.refreshTokenId,
    );
    if (!customer) {
      throw new BadRequestException('token expired');
    }
    return customer;
  }
}
