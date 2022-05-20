import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('customers')
export class CustomersController {}
