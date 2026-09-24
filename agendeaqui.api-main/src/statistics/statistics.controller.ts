import {
  Controller,
  Get,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';
import { ClinicStatisticsDto } from './dto/clinic-statistics.dto';
import { Role } from '@prisma/client';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('clinic')
  async getClinicDashboardStatistics(
    @Request() req,
  ): Promise<ClinicStatisticsDto> {
    const userId = req.user.id;
    const userRole: Role = req.user.role;

    let clinicId: string;

    if (userRole === Role.CLINIC) {
      const clinic = await this.statisticsService['prisma'].clinic.findUnique({
        where: { userId: userId },
        select: { id: true },
      });

      if (!clinic) {
        throw new NotFoundException(
          'Clínica associada ao usuário não encontrada.',
        );
      }
      clinicId = clinic.id;
    } else {
      throw new ForbiddenException(
        'Acesso negado. Apenas clinicas podem ver as estatísticas.',
      );
    }

    return this.statisticsService.getClinicDashboardStatistics(clinicId);
  }
}
