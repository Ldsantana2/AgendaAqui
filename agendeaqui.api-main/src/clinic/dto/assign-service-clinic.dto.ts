import { IsString, IsUUID, IsNumber } from 'class-validator';

export class AssignServiceClinicDto {
  @IsString()
  @IsUUID()
  serviceCategoryId: string;

  @IsNumber()
  price: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}