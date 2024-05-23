import { IsNotEmpty, IsString } from 'class-validator';

export class CheckVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
