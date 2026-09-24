import { FavoriteClinics } from './../../node_modules/.prisma/client/index.d';
import { ClinicExam } from './../clinic-exam/entities/clinic-exam.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Clinic, Role, Prisma } from '@prisma/client';
import { ClinicResponseDto } from './dto/response-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Point } from 'src/prisma/types/point';
import { FindClinicsQueryDto } from './dto/find-clinics-query.dto';
import { ClinicLocationResponseDto } from './dto/response-clinic-location.dto';
import { AssignDoctorDto } from './dto/assign-doctor.dto';
import { EmailService } from '../email/email.service';
import { ClinicLocationService } from '../clinic-location/clinic-location.service';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';

@Injectable()
export class ClinicService {
  private readonly logger = new Logger(ClinicService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicLocationService: ClinicLocationService,
    private readonly azureBlobService: AzureBlobService,
  ) { }

  async getClinic(clinicId: string): Promise<ClinicResponseDto> {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        locations: true,
        review: true,
        clinicSpecialties: {
          include: {
            specialty: true,
          },
        },
        services: {
          include: {
            serviceCategory: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new NotFoundException('clinic not found');
    }
    const specialtyIds = clinic.clinicSpecialties.map(
      (specialty) => specialty.specialtyId,
    );
    const doctors = await this.prisma.doctor.findMany({
      where: {
        specialtyLinks: {
          some: {
            specialtyId: { in: specialtyIds },
          },
        },
      },
      include: {
        specialtyLinks: {
          include: {
            specialty: true,
          },
        },
      },
    });

    const locationIds = clinic.locations.map((location) => location.id);

    let locationCoordinates = {};
    if (locationIds.length > 0) {
      const coordinates = await this.prisma.$queryRaw<
        Array<{ id: string; lat: number; lng: number }>
      >`
        SELECT 
          id, 
          ST_Y(location::geometry) as lat, 
          ST_X(location::geometry) as lng
        FROM "ClinicLocation"
        WHERE id IN (${Prisma.join(locationIds)})
        AND location IS NOT NULL
      `;

      // Create a map of location ID to coordinates
      locationCoordinates = coordinates.reduce((acc, curr) => {
        acc[curr.id] = { latitude: curr.lat, longitude: curr.lng };
        return acc;
      }, {});
    }

    const response: ClinicResponseDto = {
      id: clinic.id,
      name: clinic.name,
      about: clinic.about || undefined,
      cnpj: clinic.cnpj,
      services: clinic.services.map((service) => ({
        id: service.id,
        customName: service.customName,
        description: service.description,
        price: service.price,
        serviceCategory: {
          id: service.serviceCategory.id,
          name: service.serviceCategory.name,
        },
      })),
      locations: clinic.locations.map((location) => {
        const coords = locationCoordinates[location.id] || {};
        return {
          id: location.id,
          address: location.address,
          city: location.city,
          state: location.state,
          cep: location.cep,
          number: location.number,
          complement: location.complement,
          latitude: coords.latitude,
          longitude: coords.longitude,
        } as ClinicLocationResponseDto;
      }),
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        surname: doctor.surname,
        verified: doctor.verified,
        specialties: doctor.specialtyLinks.map((link) => ({
          id: link.specialty.id,
          name: link.specialty.name,
        })),
      })),
      reviews: clinic.review.map((review) => ({
        rating: review.rating,
        comment: review.comment || '',
        patient_id: review.patient_id,
      })),
    };

    return response;
  }

  async createClinicForUser(
    email: string,
    password: string,
    name: string,
    cnpj: string,
    location: {
      address: string;
      city: string;
      state: string;
      longitude: string | number;
      latitude: string | number;
      cep: string;
      complement?: string;
      number: string;
    },
    about?: string,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: password,
          role: 'CLINIC',
          lastLoginIp: '',
        },
      });
      const clinic = await prisma.clinic.create({
        data: {
          name: name,
          about: about,
          cnpj: cnpj,
          user: {
            connect: { id: user.id },
          },
        },
      });

      await prisma.clinicUser.create({
        data: {
          userId: user.id,
          clinicId: clinic.id,
          role: Role.CLINIC,
        },
      });

      // Convert string values to numbers if needed
      const longitudeNum =
        typeof location.longitude === 'string'
          ? parseFloat(location.longitude)
          : location.longitude;
      const latitudeNum =
        typeof location.latitude === 'string'
          ? parseFloat(location.latitude)
          : location.latitude;

      await prisma.$queryRaw`
        INSERT INTO "ClinicLocation" (id, "clinicId", address, city, state, cep, complement, number, location)
        VALUES (gen_random_uuid(), ${clinic.id}, ${location.address}, ${location.city}, ${location.state}, ${location.cep}, ${location.complement}, ${location.number}, ST_GeomFromText(${`POINT(${longitudeNum} ${latitudeNum})`}, 4326))
      `;

      return user;
    });
  }

  async getNearbyClinics(point: Point, radius: number) {
    const radiusInMeters = radius * 1000;

    const nearbyClinicLocations = await this.prisma.$queryRaw<
      Array<{ clinicId: string; distance: number }>
    >`
      SELECT DISTINCT ON (cl."clinicId")
        cl."clinicId",
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint(${point.longitude}, ${point.latitude}), 4326)::geography
        ) as distance
      FROM "ClinicLocation" cl
      WHERE ST_DWithin(
        location::geography,
        ST_SetSRID(ST_MakePoint(${point.longitude}, ${point.latitude}), 4326)::geography,
        ${radiusInMeters}
      )
      ORDER BY cl."clinicId", distance
    `;

    const clinicIds = nearbyClinicLocations.map((loc) => loc.clinicId);
    if (clinicIds.length === 0) return [];

    const clinics = await this.prisma.clinic.findMany({
      where: {
        id: {
          in: clinicIds,
        },
      },
      include: {
        locations: true,
        clinicSpecialties: {
          include: {
            specialty: true,
          },
        },
        services: {
          include: {
            serviceCategory: true,
          },
        },
        review: true,
      },
    });

    return clinics
      .map((clinic) => {
        const locationInfo = nearbyClinicLocations.find(
          (loc) => loc.clinicId === clinic.id,
        );
        if (!locationInfo) {
          throw new Error(`Location info not found for clinic ${clinic.id}`);
        }
        return {
          ...clinic,
          distance: Math.round(locationInfo.distance),
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  async updateClinic(
    clinicId: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<Clinic> {
    const { name, about } = updateClinicDto;

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      throw new BadRequestException('Clinic not found');
    }

    const updatedClinic = await this.prisma.clinic.update({
      where: { id: clinicId },
      data: {
        name,
        about,
      },
    });

    return updatedClinic;
  }

  async addServiceToClinic(
    clinicId: string,
    serviceCategoryId: string,
    customName: string,
    description: string,
    price: number,
  ) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) throw new NotFoundException('Clínica não encontrada.');

    const serviceCategory = await this.prisma.serviceCategory.findUnique({
      where: { id: serviceCategoryId },
    });
    if (!serviceCategory)
      throw new NotFoundException('Categoria de serviço não encontrada.');

    const service = await this.prisma.clinicService.create({
      data: {
        clinicId,
        serviceCategoryId,
        customName,
        description,
        price,
      },
    });

    return service;
  }

  async addLocationsToClinic(
    clinicId: string,
    locations: {
      address: string;
      city: string;
      state: string;
      cep: string;
      complement?: string;
      number: string;
    }[],
  ): Promise<void> {
    for (const location of locations) {
      const fullAddress = `${location.address}, ${location.number}, ${location.city}, ${location.state}, ${location.cep}`;

      const { lat, lon } =
        await this.clinicLocationService.getCoordinatesFromAddress(fullAddress);

      await this.prisma.$executeRaw`
        INSERT INTO "ClinicLocation" (
          id,
          "clinicId",
          address,
          city,
          state,
          cep,
          complement,
          number,
          location
        )
        VALUES (
                 gen_random_uuid(),
                 ${clinicId},
                 ${location.address},
                 ${location.city},
                 ${location.state},
                 ${location.cep},
                 ${location.complement},
                 ${location.number},
                 ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)
               )
      `;
    }
  }

  async deleteLocation(clinicId: string, locationId: string): Promise<void> {
    await this.prisma.clinicLocation.delete({
      where: {
        id: locationId,
      },
    });
  }

  async deleteSpecialtyFromClinic(
    clinicId: string,
    specialtyId: string,
  ): Promise<void> {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) {
      throw new NotFoundException('Clínica não encontrada');
    }

    const specialty = await this.prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    const existingAssociation = await this.prisma.clinicSpecialty.findFirst({
      where: {
        clinicId,
        specialtyId,
      },
    });

    if (!existingAssociation) {
      throw new BadRequestException(
        'A especialidade não está associada à clínica',
      );
    }

    await this.prisma.clinicSpecialty.delete({
      where: {
        id: existingAssociation.id,
      },
    });
  }

  async assignSpecialtyToClinic(
    clinicId: string,
    specialtyId: string,
  ): Promise<void> {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) {
      throw new NotFoundException('Clínica não encontrada');
    }

    const specialty = await this.prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    const existingAssociation = await this.prisma.clinicSpecialty.findFirst({
      where: {
        clinicId,
        specialtyId,
      },
    });

    if (existingAssociation) {
      throw new BadRequestException(
        'A especialidade já está associada à clínica',
      );
    }

    await this.prisma.clinicSpecialty.create({
      data: {
        clinicId,
        specialtyId,
      },
    });
  }

  async findClinicsBySpecialty(specialtyName: string) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { name: specialtyName },
    });

    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    const clinics = await this.prisma.clinic.findMany({
      where: {
        clinicSpecialties: {
          some: {
            specialtyId: specialty.id,
          },
        },
      },
      include: {
        locations: true,
        clinicSpecialties: {
          include: { specialty: true },
        },
        review: true,
      },
    });

    return clinics;
  }


  async findClinicsByQuery(query: FindClinicsQueryDto) {

    const {
      specialtyId,
      serviceCategoryId,
      city,
      state,
      healthOperatorId,
      startDate: startDateStr,
      endDate: endDateStr,
      latitude,
      longitude,
      clinicId,
      doctorId,
      examId
    } = query;

    const where: any = {};


    if (doctorId) {
      where.Schedule = { some: { doctorId } };
    }

    if (examId) {
      where.clinicExams = { some: { examId } };
    }


    if (specialtyId) {
      where.clinicSpecialties = {
        some: { specialtyId },
      };
    }

    if (serviceCategoryId) {
      where.services = {
        some: { serviceCategoryId },
      };
    }

    if (city) {
      where.locations = {
        some: { city },
      };
    }

    if (state) {
      where.locations = {
        ...(where.locations || {}),
        some: {
          ...(where.locations?.some || {}),
          state,
        },
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


      const cityClinicsIds = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT DISTINCT "clinicId" as id
      FROM "ClinicLocation"
      WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(${longitudeNum}, ${latitudeNum}), 4326),
        20000
      )
    `;


      if (cityClinicsIds.length > 0) {
        if (clinicId) {
          where.id = {
            in: cityClinicsIds.map((c) => c.id)
              .filter((id) => id === clinicId)
          }
        } else {
          where.id = {
            in: cityClinicsIds.map((c) => c.id),
          };
        }

        if (where.id.in.length === 0) {
          where.id = 'no-results';
        }

      } else {
        where.id = 'no-results';
      }
    }

    if (clinicId) {
      where.id = clinicId;
    }

    // Lógica de data
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
        daysOfWeek.push(currentDate.getDay());
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

    const clinics = await this.prisma.clinic.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        locations: true,
        clinicSpecialties: {
          include: { specialty: true },
        },
        services: {
          include: { serviceCategory: true },
        },
        review: true,
        healthOperators: {
          include: {
            healthOperator: true,
          },
        },
        Schedule:
          startDate && endDate
            ? {
              where: {
                dayOfWeek: {
                  in: daysOfWeek,
                },
              },
              include: {
                doctor: true,
                Appointment: {
                  where: {
                    date: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                },
              },
            }
            : false,
      },
    });
    // Get location coordinates for all clinic locations
    const locationIds = clinics.flatMap((clinic) =>
      clinic.locations.map((location) => location.id),
    );

    // Only query coordinates if there are locations
    let locationCoordinates = {};
    let clinicDistances = {};

    if (locationIds.length > 0) {
      // Query to get coordinates for all locations
      const coordinates = await this.prisma.$queryRaw<
        Array<{ id: string; lat: number; lng: number }>
      >`
      SELECT 
        id, 
        ST_Y(location::geometry) as lat, 
        ST_X(location::geometry) as lng
      FROM "ClinicLocation"
      WHERE id IN (${Prisma.join(locationIds)})
      AND location IS NOT NULL
    `;

      // Create a map of location ID to coordinates
      locationCoordinates = coordinates.reduce((acc, curr) => {
        acc[curr.id] = { latitude: curr.lat, longitude: curr.lng };
        return acc;
      }, {});

      // Calculate distances if client coordinates are provided
      if (latitude !== undefined && longitude !== undefined) {
        const latitudeNum = parseFloat(latitude);
        const longitudeNum = parseFloat(longitude);

        this.logger.log(
          `Calculating distances for ${locationIds.length} clinic locations from client coordinates [${latitudeNum}, ${longitudeNum}]`,
        );

        // Query to get distances from client location to each clinic location
        const distances = await this.prisma.$queryRaw<
          Array<{ locationId: string; clinicId: string; distance: number }>
        >`
        SELECT 
          id as "locationId",
          "clinicId",
          ST_Distance(
            location::geography,
            ST_SetSRID(ST_MakePoint(${longitudeNum}, ${latitudeNum}), 4326)::geography
          ) as distance
        FROM "ClinicLocation"
        WHERE id IN (${Prisma.join(locationIds)})
        AND location IS NOT NULL
      `;

        this.logger.log(
          `Retrieved ${distances.length} distance records from database`,
        );

        // For each clinic, find the minimum distance from any of its locations
        clinicDistances = distances.reduce((acc, curr) => {
          if (!acc[curr.clinicId] || curr.distance < acc[curr.clinicId]) {
            acc[curr.clinicId] = curr.distance;
          }
          return acc;
        }, {});

        this.logger.log(
          `Calculated minimum distances for ${Object.keys(clinicDistances).length} clinics`,
        );
      }
    }

    // Transform the clinics to include latitude, longitude, and distance in the response
    return clinics.map((clinic) => {
      const result: ClinicResponseDto = {
        ...clinic,
        about: clinic.about || undefined, // Convert null to undefined
        locations: clinic.locations.map((location) => {
          const coords = locationCoordinates[location.id] || {};
          return {
            ...location,
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }),
        doctors: [], // Add empty doctors array to satisfy TypeScript
        reviews: clinic.review.map((review) => ({
          rating: review.rating,
          comment: review.comment || '',
          patient_id: review.patient_id,
        })),
      };

      // Add distance if available
      if (clinicDistances[clinic.id] !== undefined) {
        const rawDistance = clinicDistances[clinic.id];

        // If distance is less than 1km, show in meters
        if (rawDistance < 1000) {
          const distanceInMeters = Math.round(rawDistance);
          const formattedDistance = distanceInMeters.toString() + ' m';

          this.logger.log(
            `Setting distance for clinic ${clinic.id}: raw=${rawDistance}, meters=${distanceInMeters}, formatted=${formattedDistance}`,
          );

          result.distance = formattedDistance;
        } else {
          // Otherwise show in kilometers with one decimal place
          const distanceInKm = rawDistance / 1000;
          const roundedDistance = (Math.round(distanceInKm * 10) / 10).toFixed(
            1,
          );
          const formattedDistance = `${roundedDistance.replace('.', ',')} km`;

          this.logger.log(
            `Setting distance for clinic ${clinic.id}: raw=${rawDistance}, km=${distanceInKm}, rounded=${roundedDistance}, formatted=${formattedDistance}`,
          );

          result.distance = formattedDistance;
        }
      }

      return result;
    });
  }

  async assignDoctor(clinicId: string, assignDoctorDto: AssignDoctorDto) {
    const {
      name,
      surname,
      crm,
      specialtyId,
      schedules,
      cnpj,
      aboutMe,
      gender,
      email,
    } = assignDoctorDto;

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) throw new NotFoundException('Clínica não encontrada.');

    const specialty = await this.prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty)
      throw new NotFoundException('Especialidade não encontrada.');

    const existingDoctor = await this.prisma.doctor.findFirst({
      where: { crm },
      include: {
        specialtyLinks: {
          include: { specialty: true },
        },
      },
    });

    let doctor;
    let message;
    let isNewDoctor = false;

    if (existingDoctor) {
      // Doctor already exists, use the existing doctor
      doctor = existingDoctor;
      message =
        'Médico já existe na plataforma. Vínculo com a clínica criado com sucesso.';

      // Check if the doctor already has the specialty
      const hasSpecialty = existingDoctor.specialtyLinks.some(
        (link) => link.specialtyId === specialtyId,
      );

      if (!hasSpecialty) {
        // Add the specialty to the doctor if they don't have it yet
        await this.prisma.doctorSpecialty.create({
          data: {
            doctorId: doctor.id,
            specialtyId,
            isPrimary: false, // Not primary since the doctor already exists
          },
        });
      }
    } else {
      // Create a new doctor without userId and set verified to false
      try {
        doctor = await this.prisma.doctor.create({
          data: {
            name,
            surname,
            crm,
            cnpj,
            aboutMe,
            gender,
            email,
            verified: false,
            userId: undefined,
          } as any,
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;

          if (target?.includes('crm')) {
            throw new BadRequestException('CRM já cadastrado na plataforma.');
          }

          if (target?.includes('email')) {
            throw new BadRequestException('Email já cadastrado na plataforma.');
          }

          throw new BadRequestException(
            'Dados duplicados: já existe um médico com essas informações.',
          );
        }

        throw error; // outros erros não tratados
      }

      // Create doctor specialty
      await this.prisma.doctorSpecialty.create({
        data: {
          doctorId: doctor.id,
          specialtyId,
          isPrimary: true,
        },
      });

      message =
        'Médico criado com sucesso através da clínica. Um email foi enviado para o médico com instruções para ativação.';
      isNewDoctor = true;
    }

    // Create schedules for the doctor at the clinic
    for (const schedule of schedules) {
      await this.prisma.schedule.create({
        data: {
          doctorId: doctor.id,
          clinicId,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          duration: schedule.duration,
          type: 'PRESENCIAL', // Default to in-person appointments
        },
      });
    }

    // If it's a new doctor, generate a verification code and send an email
    if (isNewDoctor) {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store the verification code in the database
      await this.prisma.doctorVerificationCode.create({
        data: {
          doctorId: doctor.id,
          clinicId,
          code,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours expiration
        },
      });

      // Get the frontend URL from environment variables
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Send verification email to the doctor
      try {
        const emailService = new EmailService();
        await emailService.sendDoctorVerificationCode(
          email,
          `${name} ${surname}`,
          clinic.name,
          code,
          frontendUrl,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send verification email to doctor ${doctor.id}`,
          error.stack,
        );
        // Continue execution even if email fails
      }
    }

    return {
      data: {
        id: doctor.id,
        name: doctor.name,
        surname: doctor.surname,
        crm: doctor.crm,
        isNewDoctor,
      },
      isSuccess: true,
      message,
    };
  }

  async regenerateDoctorCode(email: string) {
    // Find the doctor by email
    const doctor = await this.prisma.doctor.findFirst({
      where: { email },
      include: {
        verificationCode: {
          include: {
            clinic: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new BadRequestException('Médico não encontrado com este email.');
    }

    if (!doctor.verificationCode) {
      throw new BadRequestException(
        'Não há código de verificação para este médico.',
      );
    }

    const clinic = doctor.verificationCode.clinic;

    // Generate a new random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the verification code in the database
    await this.prisma.doctorVerificationCode.update({
      where: { doctorId: doctor.id },
      data: {
        code,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours expiration
      },
    });

    // Get the frontend URL from environment variables
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Send verification email to the doctor
    try {
      const emailService = new EmailService();
      await emailService.sendDoctorVerificationCode(
        email,
        `${doctor.name} ${doctor.surname}`,
        clinic.name,
        code,
        frontendUrl,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to doctor ${doctor.id}`,
        error.stack,
      );
      throw new BadRequestException('Falha ao enviar email de verificação.');
    }

    return {
      isSuccess: true,
      message: 'Novo código de verificação gerado e enviado por email.',
      data: {
        doctorId: doctor.id,
        clinicId: clinic.id,
        clinicName: clinic.name,
      },
    };
  }

  async verifyDoctorCode(code: string, email: string) {
    // Find the verification code in the database
    const verificationCode = await this.prisma.doctorVerificationCode.findFirst(
      {
        where: { code },
        include: {
          doctor: true,
          clinic: true,
        },
      },
    );

    if (!verificationCode) {
      throw new BadRequestException('Código de verificação inválido.');
    }

    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Código de verificação expirado.');
    }

    const doctor = verificationCode.doctor;

    // Check if the email matches the doctor's email
    if (doctor.email !== email) {
      throw new BadRequestException(
        'Email não corresponde ao médico associado a este código.',
      );
    }

    // Activate the doctor
    await this.prisma.doctor.update({
      where: { id: doctor.id },
      data: { verified: true } as any,
    });

    // Delete the verification code
    await this.prisma.doctorVerificationCode.delete({
      where: { id: verificationCode.id },
    });

    return {
      isSuccess: true,
      message: 'Médico ativado com sucesso e vinculado à clínica.',
      data: {
        doctorId: doctor.id,
        clinicId: verificationCode.clinicId,
        clinicName: verificationCode.clinic.name,
      },
    };
  }

  async getClinicDoctors(clinicId: string) {
    if (!clinicId || typeof clinicId !== 'string') {
      throw new Error('Parâmetro clinicId inválido.');
    }

    // Find all doctors linked to this clinic through schedules
    const doctorsFromSchedules = await this.prisma.schedule.findMany({
      where: { clinicId },
      select: { doctorId: true },
      distinct: ['doctorId'],
    });

    // Find all doctors linked to this clinic through ClinicUser
    const doctorsFromClinicUser = await this.prisma.clinicUser.findMany({
      where: {
        clinicId,
        role: 'DOCTOR',
      },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    const userIds = doctorsFromClinicUser.map((cu) => cu.user.id);

    // Get all doctors from both sources
    const doctors = await this.prisma.doctor.findMany({
      where: {
        OR: [
          {
            id: {
              in: doctorsFromSchedules
                .map((d) => d.doctorId)
                .filter((id) => id !== null),
            },
          },
          { userId: { in: userIds } },
        ],
      },
      include: {
        specialtyLinks: {
          include: {
            specialty: true,
          },
        },
      },
    });

    // Define a type that includes specialtyLinks
    type DoctorWithSpecialtyLinks = {
      id: string;
      name: string;
      surname: string;
      crm: string;
      email: string | null;
      gender: string | null;
      aboutMe: string | null;
      verified: boolean;
      specialtyLinks: {
        specialty: {
          id: string;
          name: string;
        };
      }[];
    };

    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      surname: doctor.surname,
      crm: doctor.crm,
      email: doctor.email,
      gender: doctor.gender,
      aboutMe: doctor.aboutMe,
      verified: doctor.verified,
      specialties: (doctor as DoctorWithSpecialtyLinks).specialtyLinks.map(
        (link) => ({
          id: link.specialty.id,
          name: link.specialty.name,
        }),
      ),
    }));
  }

  async getClinicPatients(clinicId: string, userRole: any) {
    console.log(
      'Valor de userRole recebido na função getClinicPatients:',
      userRole,
    );
    if (!clinicId || typeof clinicId !== 'string') {
      throw new Error('Parâmetro clinicId inválido.');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        clinicId,
        confirmationStatus: 'COMPLETED',
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
      if (!dataNascimento) return null;

      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const mes = hoje.getMonth() - dataNascimento.getMonth();

      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }

      return idade;
    }
    const medicalHistoryMap = new Map<string, any>();
    const medicationsMap = new Map<string, any>();

    if (userRole !== 'CLINIC') {
      const patientIds = Array.from(patientesMap.keys());

      const medicalHistories = await this.prisma.medicalHistory.findMany({
        where: { patientId: { in: patientIds } },
      });
      medicalHistories.forEach((h) => medicalHistoryMap.set(h.patientId, h));

      const medications = await this.prisma.medications.findMany({
        where: { patientId: { in: patientIds } },
      });
      medications.forEach((m) => medicationsMap.set(m.patientId, m));
    }
    return await Promise.all(
      Array.from(patientesMap.values()).map(async (consultas) => {
        const ultimaConsulta = consultas[0];
        const { patient, healthPlan } = ultimaConsulta;

        if (!patient || !patient.user) {
          return null;
        }

        const returnObject = {
          patientId: patient.id,
          patientName: `${patient.name} ${patient.surname}`,
          cpf: patient.cpf,
          photo: 'https://randomuser.me/api/portraits/women/90.jpg',
          age: calcularIdade(patient.birthDay || null),
          gender: patient.gender,
          healthPlan: healthPlan?.planName || undefined,
          healthPlanId: healthPlan?.id || undefined,
          healthOperatorId: healthPlan?.healthOperatorId || undefined,
          lastAppointment: ultimaConsulta.date,
          totalAppointments: consultas.length,
          contactInfo: {
            phone: patient.phone,
            email: patient.user.email,
          },
        };
        if (userRole !== 'CLINIC') {
          const medicalHistory = medicalHistoryMap.get(patient.id);
          const medicantions = medicationsMap.get(patient.id);

          Object.assign(returnObject, {
            cpf: patient.cpf,
            birthDay: patient.birthDay,
            address: {
              cep: patient.cep || undefined,
              street: patient.street || undefined,
              number: patient.number || undefined,
              city: patient.city || undefined,
              state: patient.state || undefined,
              complement: patient.complement || undefined,
            },
            hasAnamnesis: !!medicalHistory,
            hasExams: false,
            hasRequests: true,
            medicalHistory: {
              pastDiseases: medicalHistory?.pastDiseases || undefined,
              chronicDiseases: medicalHistory?.chronicDiseases || undefined,
              familySeriousDiseases:
                medicalHistory?.familySeriousDiseases || undefined,
              allergies: medicalHistory?.allergies || undefined,
            },
            medications: {
              currentMedicantions:
                medicantions?.currentMedications || undefined,
              pastMedications: medicantions?.pastMedications || undefined,
            },
          });
        }

        return returnObject;
      }),
    );
  }

  async setProfileImage(id: string, file: Express.Multer.File) {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }

    const clinic = await this.prisma.clinic.findUnique({ where: { id } });
    if (!clinic) throw new NotFoundException('Clinic not found');

    if (clinic.profileImageUrl) {
      await this.azureBlobService.deleteFileByUrl(clinic.profileImageUrl);
    }

    const { url } = await this.azureBlobService.uploadFile(file);

    await this.prisma.clinic.update({
      where: { id },
      data: { profileImageUrl: url },
    });

    return { url };
  }

  async deleteProfileImage(id: string) {
    const clinic = await this.prisma.clinic.findUnique({ where: { id } });
    if (!clinic || !clinic.profileImageUrl) {
      throw new NotFoundException('Clinic or profile image not found');
    }

    await this.azureBlobService.deleteFileByUrl(clinic.profileImageUrl);

    await this.prisma.clinic.update({
      where: { id },
      data: { profileImageUrl: null },
    });

    return { message: 'Profile image deleted' };
  }

  async findByClinicCity(clinicCity: string) {
    // Buscar clínicas na cidade
    const clinicsInCity = await this.prisma.clinic.findMany({
      where: {
        locations: {
          some: {
            city: {
              equals: clinicCity,
              mode: 'insensitive',
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        locations: {
          select: {
            address: true,
            number: true,
            city: true,
          },
        },
        review: {
          select: {
            rating: true,
          },
        },
      },
    });

    const isFallback = clinicsInCity.length === 0;

    // Se não encontrou nenhuma clínica na cidade, buscar as top do Brasil


    const clinicsWithAverage = clinicsInCity.map((clinic) => {
      const ratings = clinic.review.map(r => r.rating);
      const averageRating = ratings.length
        ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
        : 0;

      return {
        id: clinic.id,
        name: clinic.name,
        locations: clinic.locations,
        averageRating: Number(averageRating.toFixed(2)),
        location: isFallback ? "Brasil" : clinic.locations[0].city
      };
    });

    return clinicsWithAverage
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
  }

  async listSearchIndex() {
    const [clinics, schedules, specialities, exams] = await Promise.all([
      this.prisma.clinic.findMany({
        select: {
          id: true,
          name: true,
          about: true,
          locations: true,
        },
      }),
      this.prisma.schedule.findMany({
        distinct: ['doctorId'],
        include: {
          clinic: {
            select: {
              locations: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      }),
      this.prisma.specialty.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
      this.prisma.examType.findMany({
        select: {
          id: true,
          exams: true,
          name: true,
          description: true
        },
      }),
    ]);

    const doctors = schedules.map((schedule) => ({
      ...schedule.doctor,
      locations: schedule.clinic?.locations ?? [],
    }));

    return { clinics, doctors, specialities, exams };
  }

  async assignFavoriteToClinic(clinicId: string, patientId: string) {
    try {

      const clinicExists = await this.prisma.clinic.findUnique({
        where: { id: clinicId }
      });

      if (!clinicExists) {
        throw new Error(`Clínica com o ID ${clinicId} não encontrada.`);
      }

      const patientExists = await this.prisma.patient.findUnique({
        where: { id: patientId }
      });
      if (!patientExists) {
        throw new Error(`Paciente com o ID ${patientId} não encontrado.`);
      }


      const existingFavorite = await this.prisma.favoriteClinics.findFirst({
        where: {
          clinicId: clinicId,
          patientId: patientId,
        },
      });

      if (existingFavorite) {
        return existingFavorite;
      }

      const favorite = await this.prisma.favoriteClinics.create({
        data: {
          clinicId: clinicId,
          patientId: patientId,
        },
      });

      return favorite;

    } catch (error) {
      console.error(`Erro ao adicionar clínica favorita: ${error.message}`);
      throw new Error('Não foi possível adicionar a clínica favorita. Verifique os IDs fornecidos.');
    }
  }

  async removeFavoriteClinic(id: string) {
    try {
      const favoriteToDelete = await this.prisma.favoriteClinics.findFirst({
        where: {
          id
        },
      });

      if (!favoriteToDelete) {
        throw new Error('Clínica favorita não encontrada para este paciente.');
      }

      const deletedFavorite = await this.prisma.favoriteClinics.delete({
        where: {
          id: favoriteToDelete.id,
        },
      });

      return deletedFavorite;
    } catch (error) {
      console.error(`Erro ao remover clínica favorita: ${error.message}`);
      throw new Error('Não foi possível remover a clínica favorita.');
    }
  }

  async getFavoriteClinics(patientId: string, clinicId?: string, specialtyId?: string) {
    try {
      const favoriteClinics = await this.prisma.favoriteClinics.findMany({
        where: {
          patientId: patientId,
          clinic: {
            AND: [
              // Filtra pelo ID da clínica se for fornecido
              clinicId ? {
                id: clinicId,
              } : {},
              // Filtra pelo ID da especialidade se for fornecido
              specialtyId ? {
                clinicSpecialties: {
                  some: {
                    specialtyId: specialtyId,
                  },
                },
              } : {},
            ],
          },
        },
        include: {
          clinic: {
            include: {
              clinicSpecialties: {
                include: {
                  specialty: true,
                },
              },
            },
          },
        },
      });

      const clinics = favoriteClinics.map(fav => fav.clinic);

      return clinics;

    } catch (error) {
      console.error(`Erro ao buscar clínicas favoritas: ${error.message}`);
      throw new Error('Não foi possível buscar as clínicas favoritas.');
    }
  }

  async findFavoriteClinicByPatientAndClinic(patientId: string, clinicId: string) {
    try {
      const favoriteRecord = await this.prisma.favoriteClinics.findFirst({
        where: {
          clinicId,
          patientId,
        },
      });

      return favoriteRecord ? [favoriteRecord] : [];
    } catch (error) {
      console.error("Erro ao verificar favorito da clínica:", error);
      throw new Error("Falha ao buscar favorito da clínica.");
    }
  }

}