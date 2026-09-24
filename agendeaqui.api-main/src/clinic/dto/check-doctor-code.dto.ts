import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CheckDoctorCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}