import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { CustomersModule } from '../customers/customers.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CustomersModule, AuthModule],
  providers: [TwoFactorAuthenticationService],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
