import axios from "axios";
import { getToken } from "./authService";
import { OwnerPatient } from "../entities/DoctorPatient";

const API_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getPatientByEmail = async (email: string) => {
  const token = getToken();

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  const response = await axios.get(`${API_URL}/patient/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const updatePatient = async (patientId: string, patientData: any) => {
  const token = getToken();

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.patch(
      `${API_URL}/patient/${patientId}`,
      patientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }
};

export const getPatients = async (
  params: PaginationParams,
  ownerId: string,
): Promise<PaginatedResponse<any>> => {
  const token = getToken();

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const owner = ownerId.split(" ")[0];
    const id = ownerId.split(" ")[2];

    let response;

    if (owner === "doctor") {
      response = await axios.get(`${API_URL}/doctor/${id}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (owner === "clinic") {
      response = await axios.get(`${API_URL}/clinic/${id}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (response === null) {
      response = await axios.get(`${API_URL}/clinic/${ownerId}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    let filteredPatients: OwnerPatient[] = response.data.data;

    // Apply search if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPatients = filteredPatients.filter(
        (patient) =>
          patient.patientName.toLowerCase().includes(searchLower) ||
          patient.contactInfo.email.toLowerCase().includes(searchLower) ||
          patient.contactInfo.phone.includes(searchLower),
      );
    }

    if (params.sortBy) {
      filteredPatients.sort((a, b) => {
        let valueA, valueB;

        if (params.sortBy.includes(".")) {
          const parts = params.sortBy.split(".");
          valueA = parts.reduce((obj, key) => obj[key], a);
          valueB = parts.reduce((obj, key) => obj[key], b);
        } else {
          valueA = a[params.sortBy];
          valueB = b[params.sortBy];
        }

        if (typeof valueA === "string") {
          const comparison = valueA.localeCompare(valueB);
          return params.sortOrder === "desc" ? -comparison : comparison;
        } else {
          const comparison = valueA - valueB;
          return params.sortOrder === "desc" ? -comparison : comparison;
        }
      });
    }

    const total = filteredPatients.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    return {
      data: paginatedPatients,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw error;
  }
};
