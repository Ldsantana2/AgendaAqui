import { IsString, MinLength, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  code: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  newPassword: string;
}