import { ClinicDoctor } from "./ClinicDoctor";
import { ClinicLocation } from "./ClinicLocation";
import { ClinicService } from "./ClinicService";
import { ClinicReview } from "./ClinicReview";
import { TreatedArea } from "./TreatedArea";
import { Specialty } from "./specialty";

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  profileImage?: string;
  specialties?: Specialty[];
  about?: string;
  locations?: ClinicLocation[];
  services?: ClinicService[];
  doctors?: ClinicDoctor[];
  reviews?: ClinicReview[];
  healthOperator?: any[];
  averageRatingRaw?: number;
  treatedAreas?: TreatedArea[];
}
