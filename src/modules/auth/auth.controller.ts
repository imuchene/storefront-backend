import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { Customer } from '../customers/entities/customer.entity';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ){
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res({ passthrough: true}) res: Response, ){
    const token = await this.authService.createJwtToken(req.user as Customer);

    const secretData = {
      token,
      refreshToken: '',
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'success' };
  }

  @Post('register')
  async register(@Body() registrationData: CreateCustomerDto): Promise<Customer>{
    return await this.authService.register(registrationData);
  }
}
