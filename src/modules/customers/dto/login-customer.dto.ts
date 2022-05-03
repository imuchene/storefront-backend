import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
