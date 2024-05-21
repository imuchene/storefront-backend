import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
    let base32Secret: string;

    // First check if there's an existing secret for the customer stored in redis
    const storedSecret = await this.cacheManager.get<string>(
      `${RedisKeys.TwoFactorSecret}:${customer.id}`,
    );

    const secret = crypto.randomBytes(12).toString('hex').toUpperCase();

    if (storedSecret) {
      // If there's an existing secret, set the secret to be used to be the stored secret
      base32Secret = storedSecret;
    } else {
      // If no secret exists for the customer, generate a new one
      base32Secret = base32.encode(Buffer.from(secret));
    }

    // Save the secret to redis and set it to not expire (expiry = 0)
    await this.cacheManager.set(
      `${RedisKeys.TwoFactorSecret}:${customer.id}`,
      base32Secret,
      0,
    );

    const totp = await this.createOtpObject(base32Secret);

    const uri = OTPAuth.URI.stringify(totp);

    return uri;
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void> {
    return toFileStream(stream, otpAuthUrl);
  }

  async validateTwoFactorCode(
    token: string,
    customer: Customer,
  ): Promise<boolean> {
    const secret = await this.cacheManager.get<string>(
      `${RedisKeys.TwoFactorSecret}:${customer.id}`,
    );
    const totp = await this.createOtpObject(secret);

    const validationCheck = totp.validate({ token, window: 1 });

    if (Number.isInteger(validationCheck)) {
      return true;
    } else {
      throw new UnauthorizedException('Wrong authentication code');
    }
  }
}
