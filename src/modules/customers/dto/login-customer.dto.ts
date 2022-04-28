import { IsNotEmpty, IsString } from 'class-validator';


export class LoginCustomerDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

}
