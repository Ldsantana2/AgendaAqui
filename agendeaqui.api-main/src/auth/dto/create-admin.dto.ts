import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  passwordConfirmation: string;

  @IsBoolean()
  isTermsAndConditionsAccepted: boolean;
}