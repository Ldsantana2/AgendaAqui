export class ClinicServiceResponseDto {
  id: string;
  customName: string;
  description: string;
  price: number;
  serviceCategory: {
    id: string;
    name: string;
  };
}