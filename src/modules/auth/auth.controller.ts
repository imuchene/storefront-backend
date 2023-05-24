import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CookieNames } from '../../common/enums/cookie-names.enum';

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

    res.cookie(CookieNames.AuthCookie, secretData, {
      expires: new Date(Date.now() + 900000), // Set the cookie to expire in 900000 milliseconds = 15 minutes
      sameSite: 'none', // allow cross origin requests i.e. requests from different domains (since our frontend is hosted on a different domain)
      httpOnly: true, // forbid the cookie being accessed by client side javascript
      signed: true, // prevent the cookie from being tampered with by appending a signature with the cookie
      secure: true // the cookie can only be sent via a secure protocol i.e. HTTPS (this is also a pre-requisite for using sameSite: none)
    });

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

    res.cookie(CookieNames.RefreshCookie, secretData, {
      expires: new Date(Date.now() + 900000),
      sameSite: 'none',
      httpOnly: true,
      signed: true,
      secure: true,
    });
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
    const tokenData: SecretData = req.signedCookies[CookieNames.AuthCookie];

    // Remove refresh token from redis
    await this.authService.removeJwtRefreshToken(
      customer.id,
      tokenData.refreshTokenId,
    );
    // Delete auth cookie and refresh cookie
    res.clearCookie(CookieNames.AuthCookie, { 
      signed: true, 
      httpOnly: true,       
      sameSite: 'none',
      secure: true, 
    });

    res.clearCookie(CookieNames.RefreshCookie, {
      signed: true,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send({ msg: 'success' }).end();
  }
}
