import axios from "axios";
import { getToken } from "./authService";

const base_url_api = process.env.NEXT_PUBLIC_BASE_ROUTE;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_ROUTE,
});

// Adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Buscar todos os operadores de saúde disponíveis (para adicionar)
export const getAllHealthOperators = async () => {
  try {
    const response = await api.get("/health-operator");
    return response.data?.data || [];
  } catch (error: any) {
    console.error("❌ Erro ao buscar operadores de saúde:", error.message);
    throw new Error("Erro ao buscar operadores de saúde.");
  }
};

// 📌 Buscar operadores vinculados à clínica
export const getOperatorsByClinic = async (clinicId: string) => {
  try {
    const response = await api.get(`/clinic-health-operator/${clinicId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar operadores da clínica:", error.message);
    throw new Error("Erro ao buscar operadores da clínica.");
  }
};

// ➕ Atribuir operador à clínica
export const assignOperatorToClinic = async (
  clinicId: string,
  healthOperatorId: string,
) => {
  try {
    await api.post("/clinic-health-operator", { clinicId, healthOperatorId });
  } catch (error: any) {
    console.error("❌ Erro ao atribuir operador:", error.message);
    throw new Error("Erro ao atribuir operador à clínica.");
  }
};

// ➖ Remover operador da clínica
export const removeOperatorFromClinic = async (
  clinicId: string,
  healthOperatorId: string,
) => {
  try {
    await api.delete("/clinic-health-operator", {
      data: { clinicId, healthOperatorId },
    });
  } catch (error: any) {
    console.error("❌ Erro ao remover operador:", error.message);
    throw new Error("Erro ao remover operador da clínica.");
  }
};

export async function getClinicHealthOperators(clinicId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_ROUTE}/clinic-health-operator/${clinicId}`,
  );
  if (!res.ok) throw new Error("Erro ao buscar convênios da clínica");
  const data = await res.json();
  return data.data; // ajuste conforme seu formato
}
