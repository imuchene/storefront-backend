import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OTPAuth from 'otpauth';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import crypto from 'crypto';

@Injectable()
export class TwoFactorAuthenticationService {
  private readonly logger = new Logger(TwoFactorAuthenticationService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateTwoFactorAuthenticationSecret() {
    const issuer = this.configService.getOrThrow(
      'TWO_FACTOR_AUTHENTICATION_ISSUER',
    );
    const secret = crypto.randomBytes(12).toString('hex').toUpperCase();

    this.logger.log('secret', secret);

    const totp = new OTPAuth.TOTP({
      issuer: issuer,
      label: issuer,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const uri = OTPAuth.URI.stringify(totp);

    this.logger.log('uri', uri);

    return uri;
  }

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }
}
