import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const base_url_api = process.env.NEXT_PUBLIC_BASE_ROUTE;

// Atualizar especialidades do médico
export async function updateDoctorSpecialties(
  doctorId: string,
  specialtyIds: string[],
) {
  try {
    const payload = { doctorId, specialtyIds };
    const response = await axios.patch(
      `${base_url_api}/doctor-specialty/update-specialties`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar especialidades:", error);
    throw error;
  }
}

// Buscar todas as especialidades (hook para react-query, se quiser)
export function useFetchSpecialtiesQuery() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const response = await fetch(`${base_url_api}/specialty`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
