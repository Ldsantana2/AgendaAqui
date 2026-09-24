import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClinicTreatedAreaService } from './clinic-treated-area.service';
import { AssignTreatedAreaDto } from './dto/assign-treated-area.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('clinics')
export class ClinicTreatedAreaController {
  constructor(
    private readonly clinicTreatedAreaService: ClinicTreatedAreaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':clinicId/treated-areas')
  async assignTreatedArea(
    @Param('clinicId') clinicId: string,
    @Body() dto: AssignTreatedAreaDto,
  ) {
    return this.clinicTreatedAreaService.assignTreatedArea(
      clinicId,
      dto.treatedAreaId,
    );
  }

  @Get(':clinicId/treated-areas')
  async getTreatedAreas(@Param('clinicId') clinicId: string) {
    return this.clinicTreatedAreaService.getTreatedAreasByClinic(clinicId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':clinicId/treated-areas/:treatedAreaId')
  async removeTreatedArea(
    @Param('clinicId') clinicId: string,
    @Param('treatedAreaId') treatedAreaId: string,
  ) {
    return this.clinicTreatedAreaService.removeTreatedArea(
      clinicId,
      treatedAreaId,
    );
  }
}
