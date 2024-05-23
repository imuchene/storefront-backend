import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Customer } from '../customers/entities/customer.entity';
import { CheckVerificationCodeDto } from './dto/check-verification-code.dto';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate_verification')
  async initiatePhoneNumberVerification(@Req() request: Request) {
    const customer = await this.validatePhoneNumber(request);

    await this.smsService.initiatePhoneNumberVerification(customer.phoneNumber);

    return { message: 'Code successfully sent' };
  }

  @Post('check_verification_code')
  async checkVerificationCode(
    @Req() request: Request,
    @Body() verificationData: CheckVerificationCodeDto,
  ): Promise<any> {
    const customer = await this.validatePhoneNumber(request);

    await this.smsService.confirmPhoneNumber(
      customer.id,
      customer.phoneNumber,
      verificationData.code,
    );

    return { message: 'Phone number successfully confirmed' };
  }

  async validatePhoneNumber(request: Request): Promise<Customer> {
    const customer: Customer = request.user as Customer;

    if (customer.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }

    return customer;
  }
}
