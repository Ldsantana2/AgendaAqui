import api from "./api";
import type { Specialty } from "../entities/specialty";

const getSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await api.get("/specialty");

    const payload = response.data;

    if (Array.isArray(payload)) {
      return payload as Specialty[];
    }

    if (payload.data && Array.isArray(payload.data)) {
      return payload.data as Specialty[];
    }

    return [] as Specialty[];
  } catch (error) {
    console.error("Erro ao carregar especialidades:", (error as Error).message);
    throw error;
  }
};

const getDoctorSpecialtiesByDoctorId = async (
  doctorId: string,
): Promise<any[]> => {
  try {
    const response = await api.get(`/doctor-specialty/doctor/${doctorId}`);

    return response.data.data; // ✅ NOT just response.data
  } catch (error) {
    console.error(
      "Erro ao buscar especialidades do doutor:",
      (error as Error).message,
    );
    throw error;
  }
};

const addClinicSpecialty = async (
  clinicId: string,
  specialtyId: string,
): Promise<void> => {
  try {
    await api.post(`/clinic/${clinicId}/assign-specialty`, {
      specialtyId,
    });
  } catch (error) {
    console.error(
      "Erro ao adicionar especialidade à clínica:",
      (error as Error).message,
    );
    throw error;
  }
};

const removeClinicSpecialty = async (
  clinicId: string,
  specialtyId: string,
): Promise<void> => {
  try {
    await api.delete(`/clinic/${clinicId}/specialties/${specialtyId}`);
  } catch (error) {
    console.error(
      "Erro ao remover especialidade da clínica:",
      (error as Error).message,
    );
    throw error;
  }
};

export async function getClinicSpecialtiesByClinicId(clinicId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic-specialty/by-clinic/${clinicId}`,
  );
  if (!res.ok) throw new Error("Erro ao buscar especialidades da clínica");
  const data = await res.json();
  return data.data; // ajuste conforme seu formato
}

export {
  getSpecialties,
  getDoctorSpecialtiesByDoctorId,
  addClinicSpecialty,
  removeClinicSpecialty,
};
