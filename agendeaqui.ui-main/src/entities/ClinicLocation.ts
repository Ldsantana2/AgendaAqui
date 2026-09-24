import { number } from "zod";
import { Clinic } from "./Clinic";

export interface ClinicLocation {
  id: string;
  address: string;
  complement?: string;
  city: string;
  cep: string;
  state: string;
  number?: string;
  bairro?: string;
  latitude?: number;
  longitude?: number;
  clinicId: string;
  clinic?: Clinic;
}
