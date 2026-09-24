import { IsString } from 'class-validator';

export class UpdateClinicDto {
  @IsString()
  name: string;

  @IsString()
  about: string;
}
