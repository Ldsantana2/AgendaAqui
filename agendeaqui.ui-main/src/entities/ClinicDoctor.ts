import {Specialty} from "./specialty";

export interface ClinicDoctor {
  email: string;
  id: string;
  name: string;
  surname: string;
  crm: string;
  profileImage?: string;
  specialties?: Specialty[];
  rating?: number;
  verified?: boolean;
}
