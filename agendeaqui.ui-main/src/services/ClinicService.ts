import axios from "axios";
import api from "./api";
import { Clinic } from "../entities/Clinic";
import { ServiceCategory } from "../entities/serviceCategory";
import { ClinicLocation } from "../entities/ClinicLocation";
import { Review } from "../entities/Review";
import { SearchFilters } from "../pages/search";

// Buscar uma clínica por ID
export const getClinic = async (id: string): Promise<Clinic> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Falha ao carregar os dados da clínica");
    }

    const payload = await response.json();
    return payload.data as Clinic;
  } catch (error) {
    console.error(
      "Erro ao carregar os dados da clínica:",
      (error as Error).message,
    );
    throw error;
  }
};

//Buscar clinica pela cidade
export const getClinicsByCity = async (
  cityId: string,
): Promise<Clinic[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/by-clinic-city/${cityId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Falha ao carregar os dados da clínica");
    }

    const payload = await response.json();
    return payload.data as Clinic[];
  } catch (error) {
    console.error(
      "Erro ao carregar os dados da clínica:",
      (error as Error).message,
    );
    throw error;
  }
};

export const searchClinics = async (filters: SearchFilters): Promise<Clinic[]> => {
  try {
    const {
      doctorId,
      clinicId,
      examId,
      specialtyId,
      healthOperatorId,
      startDate,
      endDate,
      latitude,
      longitude,
    } = filters;

    const params: Record<string, string> = {};

    if (doctorId) params.doctorId = doctorId;
    if (clinicId) params.clinicId = clinicId;
    if (examId) params.examId = examId;
    if (specialtyId) params.specialtyId = specialtyId;
    if (healthOperatorId) params.healthOperatorId = healthOperatorId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (latitude) params.latitude = latitude;
    if (longitude) params.longitude = longitude

    console.log("Parâmetros de busca:", params);

    const response = await api.get("/clinic/search", { params });

    console.log("URL chamada:", response.config.url);

    return Array.isArray(response.data?.data) ? response.data.data : [];
  }
  catch (error) {
    console.error("Erro ao buscar clínicas:", (error as Error).message);
    throw error;
  }
};

export const getClinicsNearby = async (
  latitude: number,
  longitude: number,
  kilometers: number,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/nearby`,
    {
      params: { latitude, longitude, kilometers },
    },
  );
  return response.data.data;
};

export async function updateClinic(clinicData: {
  id: string;
  name: string;
  cnpj: string;
  about: string;
  profileImage?: string;
}) {
  try {
    const payload = {
      name: clinicData.name,
      cnpj: clinicData.cnpj,
      about: clinicData.about,
    };

    console.log(payload);
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/${clinicData.id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar clínica:", error);
    throw error;
  }
}

// Buscar médicos vinculados a uma clínica
export const getClinicDoctors = async (clinicId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/${clinicId}/doctors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Falha ao carregar os médicos vinculados à clínica");
    }

    const payload = await response.json();
    console.log(payload);
    return payload.data || [];
  } catch (error) {
    console.error(
      "Erro ao carregar médicos vinculados:",
      (error as Error).message,
    );
    throw error;
  }
};

// Cadastrar um médico vinculado a uma clínica
export const registerClinicDoctor = async (
  clinicId: string,
  doctorData: {
    name: string;
    surname: string;
    crm: string;
    email: string;
    specialtyId: string;
    schedule: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      duration?: number;
    }[];
    cnpj?: string;
    aboutMe?: string;
    gender?: "male" | "female" | "other";
  },
) => {
  try {
    // Transform the data to match the AssignDoctorDto structure
    const payload = {
      name: doctorData.name,
      surname: doctorData.surname,
      crm: doctorData.crm,
      email: doctorData.email,
      specialtyId: doctorData.specialtyId,
      schedules: doctorData.schedule.map((item) => ({
        dayOfWeek:
          typeof item.dayOfWeek === "string"
            ? [
              "SUNDAY",
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
            ].indexOf(item.dayOfWeek)
            : parseInt(item.dayOfWeek),
        startTime: item.startTime,
        endTime: item.endTime,
        duration: item.duration || 30, // Default duration if not provided
      })),
      cnpj: doctorData.cnpj,
      aboutMe: doctorData.aboutMe,
      gender: doctorData.gender,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic/${clinicId}/assign-doctor`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Falha ao cadastrar médico na clínica");
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao cadastrar médico na clínica:",
      (error as Error).message,
    );
    throw error;
  }
};

// Verificar o PIN do médico
export const verifyDoctorPin = async (verificationData: {
  code: string;
  email: string;
}) => {
  try {
    const response = await api.post("/clinic/verify-doctor", verificationData);
    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Falha ao verificar o PIN do médico",
      );
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao verificar o PIN do médico:",
      (error as Error).message,
    );
    // If the error has a response with a message, pass it along
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Verificar se um código de verificação existe e se já expirou
export interface CheckDoctorCodeResponse {
  isValid: boolean;
  isExpired: boolean;
  doctorId?: string;
  clinicId?: string;
  clinicName?: string;
  expiresAt?: string;
  code?: string;
}

// Gerar um novo código de verificação para o médico
export interface GenerateDoctorCodeResponse {
  code: string;
  expiresAt: string;
  message?: string;
}

export const generateDoctorCode = async (generateData: {
  email: string;
  clinicId: string;
}): Promise<GenerateDoctorCodeResponse> => {
  try {
    const response = await api.post(
      "clinic/generate-doctor-code",
      generateData,
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        response.data?.message || "Falha ao gerar novo código para o médico",
      );
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao gerar novo código para o médico:",
      (error as Error).message,
    );
    // If the error has a response with a message, pass it along
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Regenerar um código de verificação para o médico
export interface RegenerateDoctorCodeDto {
  email: string;
}

export const regenerateDoctorCode = async (
  regenerateData: RegenerateDoctorCodeDto,
): Promise<GenerateDoctorCodeResponse> => {
  try {
    const response = await api.post(
      "/clinic/regenerate-doctor-code",
      regenerateData,
    );

    console.log(response);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        response.data?.message || "Falha ao regenerar código para o médico",
      );
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao regenerar código para o médico:",
      (error as Error).message,
    );
    // If the error has a response with a message, pass it along
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const getAllServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/service_category`,
    );
    if (response.status !== 200) {
      throw new Error("Falha ao carregar categorias de serviço");
    }
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Erro ao carregar categorias de serviço:",
      (error as Error).message,
    );
    throw error;
  }
};

export const getClinicReviews = async (id: string): Promise<Review[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/reviews/clinic/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Falha ao carregar as reviews da clínica");
    }

    const payload = await response.json();
    return payload.data;
  } catch (error) {
    console.error(
      "Erro ao carregar as reviews da clínica:",
      (error as Error).message,
    );
    throw error;
  }
};
