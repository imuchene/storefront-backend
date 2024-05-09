import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCustomer } from '../../common/decorators/get-customer.decorator';
import { Customer } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication.dto';

@Controller('two_factor_authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly customersService: CustomersService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(
    @Res() response: Response,
    @GetCustomer() customer: Customer,
  ): Promise<void> {
    const otpAuthUrl =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        customer,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('turn_on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @GetCustomer() customer: Customer,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ): Promise<boolean> {
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        customer,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.customersService.turnOnTwoFactorAuthentication(customer.id);

    return true;
  }
}
