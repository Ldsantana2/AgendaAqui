import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { AssignSpecialtyDto } from './dto/assign-specialty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateDoctorSpecialtiesDto } from './dto/update-doctor-specialties.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtyService.create(dto);
  }

  @Get()
  async findAll() {
    return this.specialtyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/doctor/set-primary')
  async setPrimarySpecialty(@Body() dto: AssignSpecialtyDto) {
    return this.specialtyService.setPrimarySpecialty(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/assign')
  async assignSpecialty(@Body() dto: AssignSpecialtyDto) {
    return this.specialtyService.assignSpecialtyToDoctor(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('doctor/:doctorId/specialties')
  async updateDoctorSpecialties(
    @Param('doctorId') doctorId: string,
    @Body() updateDoctorSpecialtiesDto: UpdateDoctorSpecialtiesDto,
  ) {
    try {
      return await this.specialtyService.updateDoctorSpecialties(
        doctorId,
        updateDoctorSpecialtiesDto,
      );
    } catch (error) {
      console.error(
        'Erro interno ao atualizar especialidades do médico:',
        error,
      ); // <-- Adicione isso
      throw new InternalServerErrorException(
        'Erro ao atualizar especialidades do médico',
      );
    }
  }
}
