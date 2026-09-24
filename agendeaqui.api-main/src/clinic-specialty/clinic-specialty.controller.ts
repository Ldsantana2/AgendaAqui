import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ClinicSpecialtyService } from './clinic-specialty.service';
import { CreateClinicSpecialtyDto } from './dto/create-clinic-specialty.dto';

@Controller('clinic-specialty')
export class ClinicSpecialtyController {
  constructor(private readonly service: ClinicSpecialtyService) {}

  @Post()
  create(@Body() dto: CreateClinicSpecialtyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-clinic/:clinicId')
  findByClinic(@Param('clinicId') clinicId: string) {
    return this.service.findByClinic(clinicId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
