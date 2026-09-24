import { getToken } from "./authService";

export interface TreatedArea {
  id: string;
  name: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export const getTreatedAreas = async (): Promise<TreatedArea[]> => {
  //const token = getToken();
  const response = await fetch(`${API_BASE_URL}/treated-areas`, {
    // headers: {
    //      Authorization: `Bearer ${token}`,
    //  },
  });

  if (!response.ok) {
    console.error("Erro na resposta da API de áreas tratadas.");
    return [];
  }
  const result = await response.json();
  if (result && Array.isArray(result.data)) {
    return result.data;
  }
  console.error("Resposta da API não contém uma lista de dados válida.");
  return [];
};

export const getClinicTreatedAreas = async (
  clinicId: string,
): Promise<TreatedArea[]> => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/clinics/${clinicId}/treated-areas`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar as áreas tratadas da clínica.");
  }
  const result = await response.json();
  if (!Array.isArray(result.data)) {
    console.error(
      "Resposta da API não contém uma lista de dados válida. Retornando array vazio.",
    );
    return [];
  }
  return result.data.map((item: any) => item.treatedArea);
};

export const addClinicTreatedArea = async (
  clinicId: string,
  treatedAreaId: string,
): Promise<void> => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/clinics/${clinicId}/treated-areas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ treatedAreaId }),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao adicionar a área tratada.");
  }
};

export const removeClinicTreatedArea = async (
  clinicId: string,
  treatedAreaId: string,
): Promise<void> => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/clinics/${clinicId}/treated-areas/${treatedAreaId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao remover a área tratada.");
  }
};
