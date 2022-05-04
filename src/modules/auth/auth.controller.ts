import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { Customer } from '../customers/entities/customer.entity';
import { AuthGuard } from '@nestjs/passport';
import { SecretData } from './interfaces/secret-data.interface';
import { RefreshGuard } from './guards/refresh-auth.guard';
import * as uuid from 'uuid';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as util from 'util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const customer = req.user as Customer;
    const refreshTokenId = uuid.v4();
    const jwtToken = await this.authService.createJwtAccessToken(customer);
    const refreshToken = await this.authService.createJwtRefreshToken(
      customer.id,
      refreshTokenId,
    );

    const secretData: SecretData = {
      jwtAccessToken: jwtToken,
      jwtRefreshToken: refreshToken,
      refreshTokenId: refreshTokenId,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true, signed: true });
    return { msg: 'success' };
  }

  @Get('refresh_token')
  @UseGuards(RefreshGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const customer = req.user as Customer;

    const jwtToken = await this.authService.createJwtAccessToken(customer);

    const refreshTokenId = uuid.v4();
    const refreshToken = await this.authService.createJwtRefreshToken(
      customer.id,
      refreshTokenId,
    );

    const secretData: SecretData = {
      jwtAccessToken: jwtToken,
      jwtRefreshToken: refreshToken,
      refreshTokenId: refreshTokenId,
    };

    res.cookie('refresh-cookie', secretData, { httpOnly: true, signed: true });
    return { msg: 'success' };
  }

  @Post('register')
  async register(
    @Body() registrationData: CreateCustomerDto,
  ): Promise<Customer> {
    return await this.authService.register(registrationData);
  }

  @Delete('log_out')
  @UseGuards(JwtAuthGuard)
  async logOut(@Req() req: Request, @Res() res: Response) {
    const customer = req.user as Customer;
    const tokenData: SecretData = req.signedCookies['auth-cookie'];

    // Remove refresh token from redis
    await this.authService.removeJwtRefreshToken(
      customer.id,
      tokenData.refreshTokenId,
    );
    // Delete auth cookie and refresh cookie
    res.clearCookie('auth-cookie', { signed: true, httpOnly: true });
    res.clearCookie('refresh-cookie', { signed: true, httpOnly: true });
    res.send({ msg: 'success' }).end();
  }
}
