import { Patient } from "../entities/patient";
import {Doctor} from "../entities/doctor";
import {Clinic} from "../entities/Clinic";

interface ProfileResponse {
  user: User;
  doctor?: Doctor;
  patient?: Patient;
  clinic?: Clinic;
}
