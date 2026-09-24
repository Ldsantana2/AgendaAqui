import { IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  code: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  newPassword: string;

  @IsString()
  @MinLength(8, { message: 'A confirmação de senha deve ter no mínimo 8 caracteres.' })
  confirmPassword: string;
}