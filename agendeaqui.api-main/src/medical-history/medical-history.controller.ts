import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Controller('medical-history')
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Post()
  create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoryService.create(createMedicalHistoryDto);
  }

  @Get()
  findAll() {
    return this.medicalHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalHistoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoryService.update(id, updateMedicalHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalHistoryService.remove(id);
  }

  // NOVAS ROTAS POR patientId

  // Buscar histórico pelo patientId
  @Get('patient/:patientId')
  findByPatientId(@Param('patientId') patientId: string) {
    return this.medicalHistoryService.findByPatientId(patientId);
  }

  // Atualizar histórico pelo patientId
  @Patch('patient/:patientId')
  updateByPatientId(
    @Param('patientId') patientId: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoryService.updateByPatientId(
      patientId,
      updateMedicalHistoryDto,
    );
  }

  // Deletar histórico pelo patientId
  @Delete('patient/:patientId')
  removeByPatientId(@Param('patientId') patientId: string) {
    return this.medicalHistoryService.removeByPatientId(patientId);
  }
}
