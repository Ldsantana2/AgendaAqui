// src/types/api-dtos.ts

// Interface para especialidades
export interface SpecialtyDto {
  id: string;
  name: string;
}

// Interface para áreas de atuação
export interface TreatedAreaDto {
  id: string;
  name: string;
}

// Interface para operadoras de saúde (planos)
export interface HealthOperatorDto {
  id: string;
  name: string;
}

// Interface para o perfil principal do Doutor
// Ajuste as propriedades conforme o que seu backend retorna para /doctor/:id
export interface DoctorResponseDto {
  id: string;
  userId: string;
  crm: string;
  name: string;
  surname: string;
  gender: string;
  birthDay: string; // Ou Date, se o backend retornar um objeto Date parseável
  aboutMe: string;
  profileImage?: string;
  specialties: SpecialtyDto[]; // Lista de especialidades
  treatedAreas: TreatedAreaDto[]; // Lista de áreas de atuação
  healthOperators: HealthOperatorDto[]; // Lista de planos de saúde
}

// Interface para os serviços do Doutor (se houver um endpoint separado para eles)
// Ajuste as propriedades conforme o que seu backend retorna para /doctor/:id/services
export interface DoctorServiceResponseDto {
  id: string;
  doctorId: string;
  category?: { id: string; name: string }; // Exemplo: se o serviço tem uma categoria aninhada
  customName?: string; // Nome customizado do serviço
  price: number;
}

// Interface para as localizações/consultórios do Doutor
// Ajuste as propriedades conforme o que seu backend retorna para /doctor/:id/locations
export interface DoctorLocationResponseDto {
  id: string;
  doctorId: string;
  address: string;
  complement?: string;
  city: string;
  state: string;
  cep: string;
  number: string;
  latitude?: number;
  longitude?: number;
}

// Interface para avaliações/reviews
// Ajuste as propriedades conforme o que seu backend retorna para /doctor/:id/reviews
export interface ReviewResponseDto {
  id: string;
  doctorId: string | null;
  patientId?: string;
  patientName?: string; // Exemplo: se o nome do paciente vem na review
  rating: number;
  comment?: string | null;
  reviewDate: Date | null;
}

// Interface para horários disponíveis
// Ajuste as propriedades conforme o que seu backend retorna para /doctor/:id/available-slots
export interface ScheduleSlotResponseDto {
  date: string;
  startTime: string;
  endTime: string;
  locationId?: string | null; // Id do consultório relacionado ao slot
  clinicName?: string; // Nome da clínica, se aplicável
}
export interface Consultation {
  id: string;
  date: string; // Ou Date, dependendo do formato
  time: string;
  // ... outras propriedades da consulta

  // Defina o objeto doctor exatamente como ele vem da API
  doctor: {
    // <--- Adicione este objeto `doctor`
    id: string;
    name?: string; // Opcional, se nem sempre vier
    surname?: string; // Opcional, se nem sempre vier
    // ... outras propriedades do médico que vêm com a consulta
  };
  // Se também vier um doctorId no nível superior (o que seria redundante com o de cima)
  // doctorId?: string; // Se o backend envia ambos, torne este opcional
}
export interface ClinicStatisticsDto {
  totalPatients: number;
  insurancePatients: number;
  privatePatients: number;
  appointmentsThisMonth: number;
  appointmentsLastMonth: number;
  canceledAppointments: number;
  averageRating: number;
  malePatients: number;
  femalePatients: number;
  newPatientsThisMonth: number;
  averageConsultationDurationMinutes: number;
  patientsByAgeGroup: { [key: string]: number };
  mostFrequentService: string;
  totalRevenueThisMonth: number;
  scheduledAppointmentsThisMonth: number;
  completedAppointmentsThisMonth: number;
}
