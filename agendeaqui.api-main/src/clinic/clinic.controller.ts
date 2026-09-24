import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Query,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ClinicService } from './clinic.service';
import { AssignSpecialtyToClinicDto } from './dto/assign-specialty-clinic.dto';
import { AssignServiceClinicDto } from './dto/assign-service-clinic.dto';
import { FindClinicsQueryDto } from './dto/find-clinics-query.dto';
import { AssignDoctorDto } from './dto/assign-doctor.dto';
import { VerifyDoctorCodeDto } from './dto/verify-doctor-code.dto';
import { RegenerateDoctorCodeDto } from './dto/regenerate-doctor-code.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) { }

  @ApiOperation({ summary: 'Atualizar os dados de uma clinica' })
  @ApiBody({ type: UpdateClinicDto })
  @Put(':id')
  async updateClinic(
    @Param('id') clinicId: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicService.updateClinic(clinicId, updateClinicDto);
  }

  @Get('nearby')
  findNearbyClinics(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('kilometers') kilometers: number,
  ) {
    return this.clinicService.getNearbyClinics(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      kilometers,
    );
  }

  @Get('search')
  findClinics(@Query() query: FindClinicsQueryDto) {
    return this.clinicService.findClinicsByQuery(query);
  }

  @Get('list-search')
  listSearchIndex() {
    return this.clinicService.listSearchIndex()
  }

  @Get(':id')
  async getClinic(@Param('id') clinicId: string) {
    return this.clinicService.getClinic(clinicId);
  }

  @Get('by-specialty/:specialtyName')
  findClinicsBySpecialty(@Param('specialtyName') specialtyName: string) {
    return this.clinicService.findClinicsBySpecialty(specialtyName);
  }

  @Get(':id/patients')
  @UseGuards(AuthGuard('jwt'))
  getClinicPatients(@Param('id') clinicId: string, @Req() req) {
    const userRole = req.user.role;
    return this.clinicService.getClinicPatients(clinicId, userRole);
  }

  @Get(':id/doctors')
  getClinicDoctors(@Param('id') clinicId: string) {
    return this.clinicService.getClinicDoctors(clinicId);
  }

  @Post(':clinicId/assign-specialty')
  async assignSpecialtyToClinic(
    @Param('clinicId') clinicId: string,
    @Body() assignDoctorToClinicDto: AssignSpecialtyToClinicDto,
  ): Promise<void> {
    const { specialtyId } = assignDoctorToClinicDto;
    await this.clinicService.assignSpecialtyToClinic(clinicId, specialtyId);
  }

  @Post(':clinicId/service')
  async addServiceToClinic(
    @Param('clinicId') clinicId: string,
    @Body() assignServiceClinicDto: AssignServiceClinicDto,
  ) {
    const { serviceCategoryId, name, price, description } =
      assignServiceClinicDto;
    return this.clinicService.addServiceToClinic(
      clinicId,
      serviceCategoryId,
      name,
      description,
      price,
    );
  }

  @Post(':clinicId/locations')
  async addLocations(
    @Param('clinicId') clinicId: string,
    @Body()
    locations: {
      address: string;
      city: string;
      state: string;
      cep: string;
      complement?: string;
      number: string;
      longitude: string;
      latitude: string;
    }[],
  ) {
    return this.clinicService.addLocationsToClinic(clinicId, locations);
  }

  @Post(':clinicId/assign-doctor')
  assignDoctor(
    @Param('clinicId') clinicId: string,
    @Body() assignDoctorDto: AssignDoctorDto,
  ) {
    return this.clinicService.assignDoctor(clinicId, assignDoctorDto);
  }

  @Post('verify-doctor')
  verifyDoctorCode(@Body() verifyDoctorCodeDto: VerifyDoctorCodeDto) {
    return this.clinicService.verifyDoctorCode(
      verifyDoctorCodeDto.code,
      verifyDoctorCodeDto.email,
    );
  }

  @Post('regenerate-doctor-code')
  @ApiOperation({
    summary: 'Gera um novo código de verificação e envia um novo email',
  })
  @ApiBody({ type: RegenerateDoctorCodeDto })
  regenerateDoctorCode(
    @Body() regenerateDoctorCodeDto: RegenerateDoctorCodeDto,
  ) {
    return this.clinicService.regenerateDoctorCode(
      regenerateDoctorCodeDto.email,
    );
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
    return this.clinicService.setProfileImage(id, file);
  }

  @Delete(':clinicId/locations/:locationId')
  async deleteLocation(
    @Param('clinicId') clinicId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.clinicService.deleteLocation(clinicId, locationId);
  }

  @ApiOperation({ summary: 'Remover uma especialidade de uma clínica' })
  @Delete(':clinicId/specialties/:specialtyId')
  async deleteSpecialtyFromClinic(
    @Param('clinicId') clinicId: string,
    @Param('specialtyId') specialtyId: string,
  ): Promise<void> {
    return this.clinicService.deleteSpecialtyFromClinic(clinicId, specialtyId);
  }

  @Delete(':id/profile-image')
  async deleteProfileImage(@Param('id') id: string) {
    return this.clinicService.deleteProfileImage(id);
  }

  @ApiOperation({ summary: 'Listas clinicas através da cidade' })
  @Get('by-clinic-city/:city')
  findByClinicCity(@Param('city') clinicCity: string) {
    return this.clinicService.findByClinicCity(clinicCity);
  }

  @Post(':patientId/favorite-clinic/:clinicId')
  async postFavoriteClinic(
    @Param("clinicId") clinicId: string,
    @Param("patientId") patientId: string
  ) {
    return this.clinicService.assignFavoriteToClinic(clinicId, patientId)
  }

  @Delete('favorite-clinic/:id')
  async deleteFavoriteFromClinic(
    @Param('id') id: string,
  ) {
    return this.clinicService.removeFavoriteClinic(id)
  }

  @Get('favorite-clinic/:patientId')
  async getPatientFavoriteClinic(
    @Param('patientId') patientId: string,
    @Query('clinicId') clinicId?: string,
    @Query('specialtyId') specialtyId?: string,
  ) {
    return this.clinicService.getFavoriteClinics(patientId, clinicId, specialtyId);
  }

  @Get(':patientId/favorite-clinic/:clinicId')
  async findFavoriteClinicByPatientAndClinic(
    @Param("clinicId") clinicId: string,
    @Param("patientId") patientId: string
  ) {
    return this.clinicService.findFavoriteClinicByPatientAndClinic(patientId, clinicId)
  }


}