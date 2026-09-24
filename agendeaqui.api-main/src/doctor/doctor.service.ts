import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateDoctorRequestDto } from './dto/create-doctor-request.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/response-doctor.dto';
import { FindDoctorsQueryDto } from './dto/find-doctors-query.dto';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';
@Injectable()
export class DoctorService {
  private readonly logger = new Logger(DoctorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async create(createDoctorRequestDto: CreateDoctorRequestDto) {
    const {
      userId,
      cnpj,
      specialtyId,
      crm,
      name,
      surname,
      gender,
      birthDay,
      email,
    } = createDoctorRequestDto;

    this.logger.log(
      `Criando doutor: ${name} ${surname}, specialtyId: ${specialtyId}`,
    );

    // Verifica se especialidade existe
    const specialtyExists = await this.prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialtyExists) {
      throw new BadRequestException('Especialidade não encontrada');
    }

    if (userId) {
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { userId },
      });
      if (existingDoctor) {
        throw new BadRequestException(
          'Doutor já cadastrado para este usuário.',
        );
      }
    }

    const birthDayDate = new Date(birthDay);
    birthDayDate.setUTCHours(0, 0, 0, 0);

    const doctor = await this.prisma.doctor.create({
      data: {
        ...(userId && { userId }),
        cnpj,
        crm,
        name,
        surname,
        gender,
        birthDay: birthDayDate.toISOString(),
        email,
      },
    });

    this.logger.log(
      `Doutor criado com ID ${doctor.id}, vinculando especialidade`,
    );

    await this.prisma.doctorSpecialty.create({
      data: {
        doctorId: doctor.id,
        specialtyId,
        isPrimary: true,
      },
    });

    this.logger.log('Vinculo de especialidade criado');

    return {
      data: null,
      isSuccess: true,
      message: 'Medico criado com sucesso.',
    };
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        specialtyLinks: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      userId: doctor.userId || undefined,
      crm: doctor.crm,
      name: doctor.name,
      surname: doctor.surname,
      specialties: doctor.specialtyLinks.map((link) => link.specialty),
    }));
  }

  async findOne(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        specialtyLinks: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doutor não encontrado.');
    }

    return {
      id: doctor.id,
      crm: doctor.crm,
      name: doctor.name,
      surname: doctor.surname,
      email: doctor.email,
      gender: doctor.gender,
      birthDay: doctor.birthDay,
      aboutMe: doctor.aboutMe,
      specialties: doctor.specialtyLinks.map((link) => link.specialty),
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      throw new NotFoundException('Doutor não encontrado.');
    }

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: {
        ...updateDoctorDto,
      },
      include: {
        specialtyLinks: {
          include: { specialty: true },
        },
      },
    });

    return {
      data: {
        id: updatedDoctor.id,
        userId: updatedDoctor.userId,
        crm: updatedDoctor.crm,
        name: updatedDoctor.name,
        surname: updatedDoctor.surname,
        email: updatedDoctor.email, // <--- adicionado aqui
        gender: updatedDoctor.gender,
        aboutMe: updatedDoctor.aboutMe,
        specialties: updatedDoctor.specialtyLinks.map((link) => link.specialty),
      },
      isSuccess: true,
      message: 'Médico atualizado com sucesso.',
    };
  }

  async remove(id: string): Promise<void> {
    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (!existingDoctor) {
      throw new NotFoundException('Doutor não encontrado.');
    }

    await this.prisma.doctor.delete({
      where: { id },
    });
  }

  async findDoctorsBySpecialty(
    specialtyName: string,
  ): Promise<DoctorResponseDto[]> {
    const specialty = await this.prisma.specialty.findUnique({
      where: { name: specialtyName },
    });

    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    const doctors = await this.prisma.doctor.findMany({
      where: {
        specialtyLinks: {
          some: {
            specialtyId: specialty.id,
          },
        },
      },
      include: {
        specialtyLinks: {
          include: { specialty: true },
        },
      },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      userId: doctor.userId || undefined,
      crm: doctor.crm,
      name: doctor.name,
      surname: doctor.surname,
      specialties: doctor.specialtyLinks.map((link) => link.specialty),
    }));
  }

  async findDoctorsByQuery(query: FindDoctorsQueryDto) {
    const {
      specialtyId,
      healthOperatorId,
      startDate: startDateStr,
      endDate: endDateStr,
      latitude,
      longitude,
    } = query;

    const where: any = {};

    if (specialtyId) {
      where.specialtyLinks = {
        some: { specialtyId },
      };
    }

    if (healthOperatorId) {
      where.healthOperators = {
        some: { healthOperatorId },
      };
    }

    if (latitude !== undefined && longitude !== undefined) {
      const latitudeNum = parseFloat(latitude);
      const longitudeNum = parseFloat(longitude);

      const cityDoctorIds = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT DISTINCT "doctorId" as id
        FROM "DoctorLocation"
        WHERE location IS NOT NULL
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${longitudeNum}, ${latitudeNum}), 4326),
          20000  -- 20km radius, 
        )
      `;

      if (cityDoctorIds.length > 0) {
        where.id = {
          in: cityDoctorIds.map((d) => d.id),
        };
      } else {
        where.id = 'no-results';
      }

      let startDate: Date | null = null;
      let endDate: Date | null = null;
      let daysOfWeek: number[] = [];

      if (startDateStr && endDateStr) {
        startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          daysOfWeek.push(currentDate.getDay()); // 0 = domingo, 6 = sábado
          currentDate.setDate(currentDate.getDate() + 1);
        }

        where.Schedule = {
          some: {
            dayOfWeek: {
              in: daysOfWeek,
            },
          },
        };

        where.NOT = {
          AND: [
            {
              Schedule: {
                every: {
                  Appointment: {
                    some: {
                      date: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
      }

      const doctors = await this.prisma.doctor.findMany({
        where,
        include: {
          specialtyLinks: {
            include: { specialty: true },
          },
          Schedule: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              duration: true,
              clinicId: true,
              Appointment:
                startDate && endDate
                  ? {
                      where: {
                        date: {
                          gte: startDate,
                          lte: endDate,
                        },
                      },
                    }
                  : false,
            },
          },
        },
      });

      // Initialize locationIds as an empty array since DoctorLocation might not be in the schema
      const locationIds: string[] = [];
      let locationCoordinates = {};
      let doctorDistances = {};

      if (locationIds.length > 0) {
        const coordinates = await this.prisma.$queryRaw<
          Array<{ id: string; lat: number; lng: number }>
        >`
          SELECT id,
                 ST_Y(location::geometry) as lat,
                 ST_X(location::geometry) as lng
          FROM "DoctorLocation"
          WHERE id IN (${Prisma.join(locationIds)})
            AND location IS NOT NULL
        `;

        if (latitude !== undefined && longitude !== undefined) {
          const latitudeNum = parseFloat(latitude);
          const longitudeNum = parseFloat(longitude);

          this.logger.log(
            `Calculating distances for ${locationIds.length} doctor locations from client coordinates [${latitudeNum}, ${longitudeNum}]`,
          );

          const distances = await this.prisma.$queryRaw<
            Array<{ locationId: string; doctorId: string; distance: number }>
          >`
            SELECT id as "locationId",
                   "doctorId",
                   ST_Distance(
                     location::geography,
                     ST_SetSRID(ST_MakePoint(${longitudeNum}, ${latitudeNum}), 4326)::geography
                   )  as distance
            FROM "DoctorLocation"
            WHERE id IN (${Prisma.join(locationIds)})
              AND location IS NOT NULL
          `;

          this.logger.log(
            `Retrieved ${distances.length} distance records from database`,
          );

          doctorDistances = distances.reduce((acc, curr) => {
            if (!acc[curr.doctorId] || curr.distance < acc[curr.doctorId]) {
              acc[curr.doctorId] = curr.distance;
            }
            return acc;
          }, {});

          this.logger.log(
            `Calculated minimum distances for ${Object.keys(doctorDistances).length} doctors`,
          );
        }
      }

      return doctors.map((doctor) => {
        const result: DoctorResponseDto = {
          id: doctor.id,
          userId: undefined,
          crm: doctor.crm,
          name: doctor.name,
          surname: doctor.surname,
          specialties: doctor.specialtyLinks.map((link) => link.specialty),
          clinicIds: doctor.Schedule.map(
            (schedule) => schedule.clinicId,
          ).filter(Boolean),
        };

        if (doctorDistances[doctor.id] !== undefined) {
          const rawDistance = doctorDistances[doctor.id];
          const roundedDistance = Math.round(rawDistance);
          const formattedDistance = roundedDistance
            .toString()
            .replace('.', ',');

          this.logger.log(
            `Setting distance for doctor ${doctor.id}: raw=${rawDistance}, rounded=${roundedDistance}, formatted=${formattedDistance}`,
          );

          result.distance = formattedDistance;
        }

        return result;
      });
    }
  }

  async getDoctorPatients(doctorId: string) {
    if (!doctorId || typeof doctorId !== 'string') {
      throw new Error('Parâmetro doctorId inválido.');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        confirmationStatus: 'COMPLETED', // O CORRETO É "CONFIRMED, ESTÁ PENDING APENAS PARA TESTE"
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        healthPlan: true,
      },
    });

    const patientesMap = new Map<string, typeof appointments>();

    for (const appt of appointments) {
      const id = appt.patient.id;
      if (!patientesMap.has(id)) {
        patientesMap.set(id, []);
      }
      patientesMap.get(id)?.push(appt);
    }

    function calcularIdade(dataNascimento: Date | null): number | null {
      if (!dataNascimento) return null; // <- checagem obrigatória

      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mes = hoje.getMonth() - dataNascimento.getMonth();

      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }

      return idade;
    }

    return await Promise.all(
      Array.from(patientesMap.values()).map(async (consultas) => {
        const ultimaConsulta = consultas[0]; // já está ordenado por data desc
        const { patient, healthPlan } = ultimaConsulta;

        if (!patient || !patient.user) {
          return null; // ignora registros malformados
        }

        const medicalHistory = await this.prisma.medicalHistory.findUnique({
          where: {
            patientId: patient.id,
          },
        });

        const medicantions = await this.prisma.medications.findUnique({
          where: {
            patientId: patient.id,
          },
        });

        return {
          patientId: patient.id,
          patientName: `${patient.name} ${patient.surname}`,
          photo: undefined, //ATUALIZAR COM FOTO REAL
          age: calcularIdade(patient.birthDay || null),
          gender: patient.gender,
          cpf: patient.cpf,
          birthDay: patient.birthDay,
          healthPlan: healthPlan?.planName || undefined,
          healthPlanId: healthPlan?.id || undefined,
          healthOperatorId: healthPlan?.healthOperatorId || undefined,
          address: {
            cep: patient.cep || undefined,
            street: patient.street || undefined,
            number: patient.number || undefined,
            city: patient.city || undefined,
            state: patient.state || undefined,
            complement: patient.complement || undefined,
          },
          lastAppointment: ultimaConsulta.date,
          totalAppointments: consultas.length,
          contactInfo: {
            phone: patient.phone,
            email: patient.user.email,
          },
          hasAnamnesis: !!medicalHistory, //ATUALIZAR COM LOGICA REAL
          hasExams: false, // ATUALIZAR COM LOGICA REAL
          hasRequests: true, // ATUALIIZAR COM LOGICA
          medicalHistory: {
            pastDiseases: medicalHistory?.pastDiseases || undefined,
            chronicDiseases: medicalHistory?.chronicDiseases || undefined,
            familySeriousDiseases:
              medicalHistory?.familySeriousDiseases || undefined,
            allergies: medicalHistory?.allergies || undefined,
          },
          medications: {
            currentMedicantions: medicantions?.currentMedications || undefined,
            pastMedications: medicantions?.pastMedications || undefined,
          },
        };
      }),
    );
  }
  async getDoctorLocations(doctorId: string) {
    // 1. Encontrar o doutor e incluir seus agendamentos (schedules)
    // 2. Para cada agendamento, incluir a ClinicLocation associada.
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
      include: {
        Schedule: {
          // Inclui todos os schedules do doutor
          include: {
            clinicLocation: true, // Para cada schedule, inclui a ClinicLocation associada
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found.`);
    }

    // Coleta todas as localizações únicas dos schedules do doutor
    const doctorLocations: any[] = [];
    const uniqueLocationIds = new Set<string>();

    for (const schedule of doctor.Schedule) {
      if (
        schedule.clinicLocation &&
        !uniqueLocationIds.has(schedule.clinicLocation.id)
      ) {
        doctorLocations.push(schedule.clinicLocation);
        uniqueLocationIds.add(schedule.clinicLocation.id);
      }
    }

    return doctorLocations;
  }

  async setProfileImage(id: string, file: Express.Multer.File) {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    if (doctor.profileImageUrl) {
      await this.azureBlobService.deleteFileByUrl(doctor.profileImageUrl);
    }

    const { url } = await this.azureBlobService.uploadFile(file);

    await this.prisma.doctor.update({
      where: { id },
      data: { profileImageUrl: url },
    });

    return { url };
  }

  async deleteProfileImage(id: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor || !doctor.profileImageUrl) {
      throw new NotFoundException('Doctor or profile image not found');
    }

    await this.azureBlobService.deleteFileByUrl(doctor.profileImageUrl);

    await this.prisma.doctor.update({
      where: { id },
      data: { profileImageUrl: null },
    });

    return { message: 'Profile image deleted' };
  }
}
