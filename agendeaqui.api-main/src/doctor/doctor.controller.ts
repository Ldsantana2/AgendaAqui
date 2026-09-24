import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FindDoctorsQueryDto } from './dto/find-doctors-query.dto';
import { CreateDoctorRequestDto } from './dto/create-doctor-request.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get('search')
  findDoctors(@Query() query: FindDoctorsQueryDto) {
    return this.doctorService.findDoctorsByQuery(query);
  }

  @Get('by-specialty/:specialtyName')
  findDoctorsBySpecialty(@Param('specialtyName') specialtyName: string) {
    return this.doctorService.findDoctorsBySpecialty(specialtyName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Get(':id/patients')
  getDoctorPacients(@Param('id') doctorId: string) {
    return this.doctorService.getDoctorPatients(doctorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Post()
  create(@Body() createDoctorDto: CreateDoctorRequestDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Patch(':id/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return this.doctorService.setProfileImage(id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }

  @Delete(':id/profile-image')
  async deleteProfileImage(@Param('id') id: string) {
    return this.doctorService.deleteProfileImage(id);
  }
}
