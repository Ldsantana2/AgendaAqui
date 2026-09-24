import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClinicExamService } from './clinic-exam.service';
import { CreateClinicExamDto } from './dto/create-clinic-exam.dto';
import { UpdateClinicExamDto } from './dto/update-clinic-exam.dto';

@Controller('clinic-exam')
export class ClinicExamController {
  constructor(private readonly clinicExamService: ClinicExamService) {}

  @Post()
  create(@Body() createClinicExamDto: CreateClinicExamDto) {
    return this.clinicExamService.create(createClinicExamDto);
  }

  @Get()
  findAll() {
    return this.clinicExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicExamService.findOne(id);
  }

  @Get('clinic/:clinicId')
  async findByClinic(@Param('clinicId') clinicId: string) {
    const data = await this.clinicExamService.findByClinic(clinicId);
    return {
      data,
      isSuccess: true,
      message: 'Request successful',
    };
  }

  @Get('clinics-by-exam/:id')
  async findClinicsByExamId(@Param('id') id: string) {
    return this.clinicExamService.findClinicsByExamId(id);
  }

  @Post('clinics-by-exams')
  async findClinicsByExamIds(@Body('examIds') examIds: string[]) {
    const data = await this.clinicExamService.findClinicsByExamIds(examIds);
    return {
      data,
      isSuccess: true,
      message: 'Request successful',
    };
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClinicExamDto: UpdateClinicExamDto,
  ) {
    return this.clinicExamService.update(id, updateClinicExamDto);
  }

  @Delete()
  async removeByClinicAndExam(
    @Body() body: { clinicId: string; examId: string },
  ) {
    const { clinicId, examId } = body;

    const clinicExam = await this.clinicExamService.findByClinicAndExam(
      clinicId,
      examId,
    );

    if (!clinicExam) {
      return {
        isSuccess: false,
        message: 'Associação entre clínica e exame não encontrada',
      };
    }

    await this.clinicExamService.remove(clinicExam.id);

    return {
      isSuccess: true,
      message: 'Exame removido da clínica com sucesso',
    };
  }
}
