import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OTPAuth from 'otpauth';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import crypto from 'crypto';
import base32 from 'hi-base32';
import { Customer } from '../customers/entities/customer.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisKeys } from '../../common/enums/redis-keys.enum';

@Injectable()
export class TwoFactorAuthenticationService {
  private readonly logger = new Logger(TwoFactorAuthenticationService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async createOtpObject(secret: string): Promise<OTPAuth.TOTP> {
    const issuer = this.configService.getOrThrow(
      'TWO_FACTOR_AUTHENTICATION_ISSUER',
    );

    const totp = new OTPAuth.TOTP({
      issuer: issuer,
      label: issuer,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    return totp;
  }

  async generateTwoFactorAuthenticationSecret(customer: Customer) {
    const secret = crypto.randomBytes(12).toString('hex').toUpperCase();

    const base32Secret = base32.encode(Buffer.from(secret));

    // Save the secret to redis and set it to not expire (expiry = 0)
    await this.cacheManager.set(
      `${RedisKeys.TwoFactorSecret}:${customer.id}`,
      base32Secret,
      0,
    );

    this.logger.log('secret', secret);
    this.logger.log('base 32 secret', base32Secret);

    const totp = await this.createOtpObject(base32Secret);

    const uri = OTPAuth.URI.stringify(totp);

    this.logger.log('uri', uri);

    return uri;
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(
    token: string,
    customer: Customer,
  ): Promise<boolean> {
    const secret = await this.cacheManager.get<string>(
      `${RedisKeys.TwoFactorSecret}:${customer.id}`,
    );
    const totp = await this.createOtpObject(secret);

    if (totp.validate({ token, window: 1 })) {
      return true;
    } else {
      return false;
    }
  }
}
