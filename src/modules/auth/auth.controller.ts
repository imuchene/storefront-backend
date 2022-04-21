import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {}
