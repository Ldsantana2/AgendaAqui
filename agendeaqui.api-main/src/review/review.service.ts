import { Appointment } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        appointmentId: createReviewDto.appointmentId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        patient_id: createReviewDto.patient_id,
        clinic_id: createReviewDto.clinic_id,
      },
    });
  }

  // Find all Reviews
  async findAll() {
    return await this.prisma.review.findMany();
  }

  // Find one Review by ID
  async findOne(id: string) {
    return await this.prisma.review.findUnique({
      where: { id },
    });
  }

  // Update a Review
  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  // Delete a Review
  async remove(id: string) {
    return await this.prisma.review.delete({
      where: { id },
    });
  }

  async findByClinicId(clinicId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { clinic_id: clinicId },
      orderBy: { created_at: 'desc' },
      include: {
        Patient: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    // Adiciona patient_name no retorno (array de objetos com campos simples):
    return reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      patient_id: review.patient_id,
      patient_name: review.Patient
        ? `${review.Patient.name} ${review.Patient.surname ?? ''}`.trim()
        : 'Paciente',
    }));
  }

  async getReviewsByAppointmentId(appointmentId: string) {
    return await this.prisma.review.findMany({
      where: { appointmentId: appointmentId },
      orderBy: { created_at: 'desc' },
      include: {
        Patient: true,
      },
    });
  }
}
