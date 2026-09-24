import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClinicServiceDto {
  @IsString()
  @IsNotEmpty()
  clinicId: string;

  @IsString()
  @IsNotEmpty()
  serviceCategoryId: string;

  @IsString()
  @IsNotEmpty()
  customName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;
}
