import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsObject } from 'class-validator';
export class ClinicStatisticsDto {
  @ApiProperty({ description: 'Total de pacientes cadastrados na clínica.' })
  totalPatients: number;

  @ApiProperty({ description: 'Número de pacientes com plano de saúde.' })
  insurancePatients: number;

  @ApiProperty({ description: 'Número de pacientes particulares.' })
  privatePatients: number;

  @ApiProperty({ description: 'Número de agendamentos este mês.' })
  appointmentsThisMonth: number;

  @ApiProperty({ description: 'Número de agendamentos no mês anterior.' })
  appointmentsLastMonth: number;

  @ApiProperty({ description: 'Número de agendamentos cancelados este mês.' })
  canceledAppointments: number;

  @ApiProperty({ description: 'Avaliação média da clínica.' })
  averageRating: number;

  @ApiProperty({ description: 'Número de pacientes masculinos.' })
  malePatients: number;

  @ApiProperty({ description: 'Número de pacientes femininos.' })
  femalePatients: number;

  @ApiProperty({ description: 'Número de novos pacientes no mês atual.' })
  newPatientsThisMonth: number;

  @ApiProperty({ description: 'Duração média das consultas em minutos.' })
  averageConsultationDurationMinutes: number;

  @ApiProperty({
    description:
      'Distribuição de pacientes por faixa etária (ex: {"0-18": 10, "19-35": 50}).',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  patientsByAgeGroup: { [key: string]: number };

  @ApiProperty({ description: 'Serviço mais frequentemente agendado.' })
  mostFrequentService: string;

  @ApiProperty({ description: 'Receita total da clínica no mês atual.' })
  totalRevenueThisMonth: number;

  @ApiProperty({
    description:
      'Número de agendamentos agendados (pendentes/confirmados) este mês.',
  })
  @IsNumber()
  scheduledAppointmentsThisMonth: number;

  @ApiProperty({
    description: 'Número de agendamentos realizados (concluídos) este mês.',
  })
  @IsNumber()
  completedAppointmentsThisMonth: number;
}
