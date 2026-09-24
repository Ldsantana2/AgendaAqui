import {Specialty} from "./specialty";

export interface Location {
  id: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  number: string;
  complement?: string;
  latitude?: number;
  longitude?: number;
}

export interface Doctor {
  id: string;
  userId: string;
  crm: string;
  name: string;
  surname: string;
  gender: string;
  aboutMe?: string;
  specialties: Specialty[];
  locations?: Location[];
  profileImage?: string;
}
