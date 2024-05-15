import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomersService } from '../../../modules/customers/customers.service';
import { Request } from 'express';
import * as fs from 'fs';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import { Customer } from '../../../modules/customers/entities/customer.entity';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    readonly configService: ConfigService,
    private readonly customerService: CustomersService,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      /* eslint-disable-next-line security/detect-non-literal-fs-filename */
      secretOrKey: fs
        .readFileSync(configService.get<string>('JWT_ACCESS_TOKEN_PUBLIC_KEY'))
        .toString(),
    })
  }

  async validate(payload: JwtTokenPayload): Promise<Customer>{
    const customer = this.customerService.getById(payload.customerId);
    if (!(await customer).isTwoFactorAuthenticationEnabled) {
      return customer;
    }

    if (payload.isSecondFactorAuthenticated) {
      return customer;
    }
  }

}
