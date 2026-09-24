import { ServiceCategory } from "./serviceCategory";

export interface ClinicService {
  id: string;
  customName: string;
  description: string;
  price: number;
  serviceCategory: ServiceCategory;
}
