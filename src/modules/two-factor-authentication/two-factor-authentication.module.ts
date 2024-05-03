import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';

@Module({
  providers: [TwoFactorAuthenticationService],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
