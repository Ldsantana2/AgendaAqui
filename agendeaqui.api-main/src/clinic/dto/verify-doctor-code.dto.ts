import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyDoctorCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}