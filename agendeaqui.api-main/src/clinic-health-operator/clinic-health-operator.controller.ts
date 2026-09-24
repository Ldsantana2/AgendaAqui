import { Controller, Post, Delete, Body, Get, Param } from '@nestjs/common';
import { ClinicHealthOperatorService } from './clinic-health-operator.service';
import { AssignClinicOperatorDto } from './dto/assign-clinic-operator.dto';

@Controller('clinic-health-operator')
export class ClinicHealthOperatorController {
  constructor(private readonly service: ClinicHealthOperatorService) {}

  @Post()
  assignOperator(@Body() data: AssignClinicOperatorDto) {
    return this.service.assignOperator(data.clinicId, data.healthOperatorId);
  }

  @Delete()
  removeOperator(@Body() data: AssignClinicOperatorDto) {
    return this.service.removeOperator(data.clinicId, data.healthOperatorId);
  }

  @Get(':clinicId')
  findOperators(@Param('clinicId') clinicId: string) {
    return this.service.findOperatorsByClinic(clinicId);
  }
}
