import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicExamDto } from './create-clinic-exam.dto';

export class UpdateClinicExamDto extends PartialType(CreateClinicExamDto) {}
