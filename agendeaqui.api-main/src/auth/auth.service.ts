import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';
import { EmailService } from '../email/email.service';

import {
  CreateClinicDto,
  CreateDoctorDto,
  CreateUserDto,
} from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role } from '@prisma/client';
import { User } from './entities/user.entity';
import { ResponseUserDto } from './dto/response-user.dto';
import { ClinicService } from '../clinic/clinic.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Lógica de login - Valida usuário e gera os tokens JWT.
   * Também atualiza informações de login como IP, data e contador de acessos.
   */
  async login(email: string, password: string, ip?: string) {
    const user = await this.validateUser(email, password);

    // Update login information
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
        loginCount: { increment: 1 },
      },
    });

    return this.generateTokens(user);
  }

  async createUser({
    email,
    password,
    phone,
    surname,
    name,
    cpf,
    gender,
    birthDay,
  }: CreateUserDto): Promise<User> {
    // Check if email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    // Check if CPF is already in use
    const existingPatient = await this.prisma.patient.findFirst({
      where: { cpf },
    });

    if (existingPatient) {
      throw new ConflictException('CPF já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PATIENT',
        lastLoginIp: '',
      },
    });

    await this.patientService.create({
      userId: user.id,
      cpf: cpf || '',
      phone: phone || '',
      name,
      surname,
      gender,
      birthDay: new Date(birthDay),
    });

    // Send registration confirmation email
    await this.emailService.sendRegistrationConfirmation(email, name);

    return this.cleanPassword(user);
  }

  async createDoctor({
    email,
    specialtyId,
    crm,
    name,
    surname,
    password,
    cnpj,
    gender,
    birthDay,
    isTermsAndConditionsAccepted,
  }: CreateDoctorDto) {
    // Check if email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    // Check if CNPJ is already in use (if provided)
    if (cnpj) {
      const existingDoctor = await this.prisma.doctor.findFirst({
        where: { cnpj },
      });

      if (existingDoctor) {
        throw new ConflictException('CNPJ já está em uso.');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'DOCTOR',
        lastLoginIp: '',
      },
    });

    await this.doctorService.create({
      userId: user.id,
      cnpj,
      specialtyId,
      crm,
      name,
      surname,
      gender,
      birthDay: new Date(birthDay),
      email: user.email,
    });

    // Send registration confirmation email
    await this.emailService.sendRegistrationConfirmation(email, name);

    return this.cleanPassword(user);
  }

  async createClinic({
    address,
    cnpj,
    email,
    name,
    password,
    passwordConfirmation,
    about,
    responsibleName,
  }: CreateClinicDto): Promise<User> {
    // Check if passwords match
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.clinicService.createClinicForUser(
      email,
      hashedPassword,
      name,
      cnpj,
      {
        address: address.street,
        city: address.city,
        state: address.state,
        cep: address.zipCode,
        latitude: parseFloat(address.location?.latitude || '0'),
        longitude: parseFloat(address.location?.longitude || '0'),
        number: address.number,
        complement: address.complement,
      },
      about,
    );

    await this.emailService.sendRegistrationConfirmation(email, name);

    return this.cleanPassword(user);
  }

  async createAdmin({
    email,
    name,
    surname,
    password,
    passwordConfirmation,
  }: CreateAdminDto): Promise<User> {
    // Check if passwords match
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    // Check if email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        lastLoginIp: '',
      },
    });

    // Send registration confirmation email
    await this.emailService.sendRegistrationConfirmation(email, name);

    return this.cleanPassword(user);
  }

  /**
   * Valida o usuário para login, garantindo e-mail e senha corretos.
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    return { ...user };
  }

  async logout(userId: string): Promise<void> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token não encontrado.');
    }

    await this.prisma.refreshToken.delete({
      where: { userId },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const code = randomInt(100000, 999999).toString();

    await this.prisma.passwordResetCode.upsert({
      where: { userId: user.id },
      update: { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      create: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.emailService.sendPasswordResetCode(email, code);
  }

  async validateToken(code: string): Promise<boolean> {
    const resetCode = await this.prisma.passwordResetCode.findFirst({
      where: { code },
    });

    if (!resetCode || resetCode.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  async resetPassword(
    code: string,
    newPassword: string,
    confirmPassword?: string,
  ): Promise<void> {
    // If confirmPassword is provided, check if it matches newPassword
    if (confirmPassword && newPassword !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const resetCode = await this.prisma.passwordResetCode.findFirst({
      where: { code },
      include: { user: true },
    });

    if (!resetCode || resetCode.expiresAt < new Date()) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: resetCode.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetCode.delete({
      where: { userId: resetCode.userId },
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { refreshToken },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: existingToken.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário associado ao token não encontrado.');
    }

    const payload = { username: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = uuidv4();

    await this.prisma.refreshToken.update({
      where: { refreshToken },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            specialtyLinks: {
              include: {
                specialty: true,
              },
            },
          },
        },
        clinic: {
          include: {
            locations: true,
            services: {
              include: {
                serviceCategory: true,
              },
            },
            clinicSpecialties: {
              include: {
                specialty: true,
              },
            },
            review: true,
          },
        },
        patient: {
          include: {
            healthPlans: {
              include: {
                healthOperator: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const response: ResponseUserDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      doctor: undefined,
      patient: undefined,
      clinic: undefined,
    };

    if (user.doctor) {
      response.doctor = {
        id: user.doctor.id,
        crm: user.doctor.crm,
        name: user.doctor.name,
        surname: user.doctor.surname,
        specialties: user.doctor.specialtyLinks.map((link) => ({
          id: link.specialty.id,
          name: link.specialty.name,
        })),
      };
    }

    if (user.patient) {
      response.patient = {
        id: user.patient.id,
        userId: user.patient.userId,
        phone: user.patient.phone,
        name: user.patient.name,
        surname: user.patient.surname,
        cpf: user.patient.cpf,
        healthPlans: user.patient.healthPlans.map((plan) => ({
          id: plan.id,
          number: plan.number,
          validUntil: plan.validUntil,
          planName: plan.planName,
          situation: plan.situation,
          accommodation: plan.accommodation,
          isPrimary: plan.isPrimary,
          healthOperator: plan.healthOperator
            ? {
                id: plan.healthOperator.id,
                name: plan.healthOperator.operatorCompanyName,
              }
            : undefined,
        })),
      };
    }

    if (user.clinic) {
      const specialtyIds = user.clinic.clinicSpecialties.map(
        (clinicSpecialty) => clinicSpecialty.specialtyId,
      );

      const doctors = await this.prisma.doctor.findMany({
        where: {
          specialtyLinks: {
            some: {
              specialtyId: { in: specialtyIds },
            },
          },
          user: { role: 'DOCTOR' },
        },
        include: {
          specialtyLinks: { include: { specialty: true } },
        },
      });

      response.clinic = {
        id: user.clinic.id,
        name: user.clinic.name,
        cnpj: user.clinic.cnpj,
        about: user.clinic.about || '',
        locations: user.clinic.locations.map((location) => ({
          id: location.id,
          address: location.address,
          city: location.city,
          state: location.state,
          cep: location.cep,
          number: location.number,
          complement: location.complement ?? undefined,
        })),
        services: user.clinic.services.map((service) => ({
          id: service.id,
          customName: service.customName,
          description: service.description,
          price: service.price,
          serviceCategory: {
            id: service.serviceCategory.id,
            name: service.serviceCategory.name,
          },
        })),
        specialties: user.clinic.clinicSpecialties.map((clinicSpecialty) => ({
          id: clinicSpecialty.specialty.id,
          name: clinicSpecialty.specialty.name,
        })),
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
        reviews: user.clinic.review.map((review) => ({
          rating: review.rating,
          comment: review.comment || '',
          patient_id: review.patient_id,
        })),
      };
    }

    return response;
  }

  private cleanPassword(user: any): any {
    return { ...user, password: undefined };
  }

  private async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private generateTokens(user: User) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }
}
