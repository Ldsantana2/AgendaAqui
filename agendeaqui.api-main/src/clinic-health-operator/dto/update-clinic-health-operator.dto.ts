import { PartialType } from '@nestjs/swagger';
import { CreateClinicHealthOperatorDto } from './create-clinic-health-operator.dto';

export class UpdateClinicHealthOperatorDto extends PartialType(CreateClinicHealthOperatorDto) {}
