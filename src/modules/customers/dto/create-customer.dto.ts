import { IsEmail, IsString } from 'class-validator';


export class CreateCustomerDto {
  @IsEmail()
  email?: string;

  @IsString()
  name?: string;

  @IsString()
  password?: string;

  @IsString()
  confirmPassword?: string;

  @IsString()
  phoneNumber?: string;
}
