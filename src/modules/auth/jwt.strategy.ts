import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomersService } from '../customers/customers.service';
import { Request } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Customer } from '../customers/entities/customer.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly customersService: CustomersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if(!data){
            return null;
          }
          return data.token;
        }
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Customer> {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return await this.customersService.getById(payload.customerId);
  }
}
