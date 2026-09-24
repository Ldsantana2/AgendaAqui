import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export const updateMedicalHistory = async (
  patientId: string,
  payload: {
    pastDiseases?: string[];
    chronicDiseases?: string[];
    familySeriousDiseases?: string[];
    allergies?: string[];
  },
) => {
  return axios.put(`${BASE_URL}/medical-history/patient/${patientId}`, payload);
};
