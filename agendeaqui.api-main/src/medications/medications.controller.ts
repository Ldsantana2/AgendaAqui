import {
  Controller,
  Post,
  Delete,
  Get,
  Patch,
  Param,
  Body,
  ParseArrayPipe,
  ParseEnumPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

enum MedicationType {
  current = 'current',
  past = 'past',
}

@Controller('patients/:patientId/medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  addMedicationsToPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() medications: CreateMedicationDto,
  ) {
    return this.medicationsService.addManyToPatient(patientId, medications);
  }

  @Get()
  findMedicationsByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.medicationsService.findByPatient(patientId);
  }
  @Patch()
  async updateMedications(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() updateDto: Partial<CreateMedicationDto>, // permite enviar parcial
  ) {
    return this.medicationsService.updateMedications(patientId, updateDto);
  }
}
