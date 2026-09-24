import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicLocationDto } from './dto/create-clinic-location.dto';
import { UpdateClinicLocationDto } from './dto/update-clinic-location.dto';


@Injectable()
export class ClinicLocationService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateClinicLocationDto) {
    const { clinicId, latitude, longitude, ...addressData } = dto;

    const data: any = {
      clinicId,
      ...addressData,
    };

    if (latitude !== undefined && longitude !== undefined) {
      const latitudeNum = parseFloat(latitude);
      const longitudeNum = parseFloat(longitude);

      data.location = {
        set: {
          type: 'Point',
          coordinates: [longitudeNum, latitudeNum],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
      };
    }

    await this.prisma.clinicLocation.create({ data });

    return {
      isSuccess: true,
      message: 'Localização adicionada com sucesso.',
    };
  }

  async findAll() {
    return this.prisma.clinicLocation.findMany();
  }

  async findOne(id: string) {
    const location = await this.prisma.clinicLocation.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Localização não encontrada.');
    }

    return location;
  }

  async findByClinicId(clinicId: string) {
    return this.prisma.clinicLocation.findMany({
      where: { clinicId },
    });
  }

  async update(id: string, dto: UpdateClinicLocationDto) {
    const { latitude, longitude, ...addressData } = dto;

    const data: any = {
      ...addressData,
    };

    if (latitude !== undefined && longitude !== undefined) {
      const latitudeNum = parseFloat(latitude);
      const longitudeNum = parseFloat(longitude);

      data.location = {
        set: {
          type: 'Point',
          coordinates: [longitudeNum, latitudeNum],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
      };
    }

    const updated = await this.prisma.clinicLocation.update({
      where: { id },
      data,
    });

    return {
      isSuccess: true,
      message: 'Localização atualizada com sucesso.',
      data: updated,
    };
  }

  async remove(id: string) {
    const location = await this.prisma.clinicLocation.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException('Localização não encontrada.');
    }

    await this.prisma.clinicLocation.delete({
      where: { id },
    });

    return {
      isSuccess: true,
      message: 'Localização removida com sucesso.',
    };
  }

  async getCoordinatesFromAddress(address: string): Promise<{ lat: number, lon: number }> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AgendaAqui/1.0 (agendaqui@seudominio.com)',
        }
      });

      const data = await response.json() as Array<{ lat: string, lon: string }>;
      if (!data || data.length === 0) {
        throw new Error('Endereço não encontrado');
      }

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } catch (err) {
      throw err;
    }
  }
}
