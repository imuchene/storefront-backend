import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomersService } from '../../customers/customers.service';
import { Request } from 'express';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { Customer } from '../../customers/entities/customer.entity';
import { SecretData } from '../interfaces/secret-data.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly customersService: CustomersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data: SecretData = request?.signedCookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.jwtAccessToken;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<Customer> {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return await this.customersService.getById(payload.customerId);
  }
}
