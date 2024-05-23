import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  confirmPassword?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/) // Phone number must be in E.164 format
  phoneNumber?: string;
}
