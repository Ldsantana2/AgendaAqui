import { PartialType } from '@nestjs/swagger';
import { CreateClinicSpecialtyDto } from './create-clinic-specialty.dto';

export class UpdateClinicSpecialtyDto extends PartialType(CreateClinicSpecialtyDto) {}
