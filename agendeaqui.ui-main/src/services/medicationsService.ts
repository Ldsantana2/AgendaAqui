import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export const updateMedications = async (
  patientId: string,
  payload: {
    currentMedications: string[];
    pastMedications: string[];
  },
) => {
  return axios.put(`${BASE_URL}/medications/patient/${patientId}`, payload);
};
