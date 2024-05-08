import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCustomer } from '../../common/decorators/get-customer.decorator';
import { Customer } from '../customers/entities/customer.entity';

@Controller('two_factor_authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @GetCustomer() customer: Customer) {
    const otpAuthUrl =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        customer,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }
}
