import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegenerateDoctorCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}