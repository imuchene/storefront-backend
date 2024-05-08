import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Customer } from '../../modules/customers/entities/customer.entity';

export const GetCustomer = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Customer => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
