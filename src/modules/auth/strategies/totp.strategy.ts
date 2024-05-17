import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { Customer } from '../../../modules/customers/entities/customer.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { CookieNames } from '../../../common/enums/cookie-names.enum';

@Injectable()
export class TotpStrategy extends PassportStrategy(Strategy, 'totp') {
  private logger = new Logger(TotpStrategy.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async validate(request: Request): Promise<Customer> {
    const customer = request.user as Customer;

    if (!customer) {
      throw new UnauthorizedException();
    }

    if (!customer.isTwoFactorAuthenticationEnabled) {
      return customer;
    }

    const jwtToken = request?.signedCookies[CookieNames.TotpCookie];

    try {
      await this.jwtService.verifyAsync(jwtToken, {
        /* eslint-disable-next-line security/detect-non-literal-fs-filename */
        publicKey: fs
          .readFileSync(
            this.configService.get<string>('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
          )
          .toString(),
      });

      return customer;
    } catch (error) {
      this.logger.error('TOTP error', error);
      throw new UnauthorizedException();
    }
  }
}
