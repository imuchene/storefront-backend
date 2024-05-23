import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import * as util from 'util';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private logger = new Logger(SmsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
  ) {
    const accountSid =
      this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const authToken =
      this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async phoneNumberLookup() {
    // this may not work in every country or return data
    // for every network. check: https://www.twilio.com/docs/lookup/v2-api/identity-match
    // and https://www.twilio.com/docs/lookup/v2-api
    this.twilioClient.lookups.v2
      .phoneNumbers('+254720123456')
      .fetch()
      .then((phone_number) => console.log(phone_number.phoneNumber));
  }

  async initiatePhoneNumberVerification(phoneNumber: string): Promise<any> {
    const serviceSid = this.configService.getOrThrow<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    try {
      return await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
    } catch (error) {
      this.logger.error('sms', util.inspect(error));
    }
  }

  async confirmPhoneNumber(
    customerId: string,
    phoneNumber: string,
    verificationCode: string,
  ): Promise<any> {
    const serviceSid = this.configService.getOrThrow<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    try {
      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: verificationCode });

      if (!result.valid || result.status !== 'approved') {
        throw new BadRequestException('Wrong code provided');
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'Code is either expired or has been already used',
      );
    }

    return await this.customersService.markPhoneNumberAsConfirmed(customerId);
  }
}
