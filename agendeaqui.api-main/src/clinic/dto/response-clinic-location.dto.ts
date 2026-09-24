export class ClinicLocationResponseDto {
  id: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  number: string;
  complement?: string | null;
  latitude?: number;
  longitude?: number;
}
