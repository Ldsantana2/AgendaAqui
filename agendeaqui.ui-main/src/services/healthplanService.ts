import { getProfile } from "./authService";
import api from "./api";

// ✅ Buscar todos os planos do paciente logado
export const getMyHealthPlans = async () => {
  const profile = await getProfile();
  const patientId = profile.patient?.id;

  if (!patientId) {
    console.warn("⚠️ Paciente logado, mas não encontrado no perfil.");
    return [];
  }

  const response = await api.get(`/health-plan/patient/${patientId}`);
  return response.data?.data || [];
};

// ✅ Criar novo plano de saúde
export const createHealthPlan = async (data: {
  healthOperatorId: string;
  healthPlanTypeId: string;
  number: string;
  validUntil: string;
  patientId: string;
}) => {
  const response = await api.post("/health-plan", data);
  return response.data;
};

export const getMyPrimaryHealthPlan = async () => {
  const profile = await getProfile();
  const patientId = profile.patient?.id;

  if (!patientId) {
    console.warn("⚠️ Paciente logado, mas não encontrado no perfil.");
    return null;
  }

  const response = await api.get(`/health-plan/patient/${patientId}/primary`);
  return response.data?.data || null;
};

// ✅ Atualizar plano de saúde
export const updateHealthPlan = async (
  id: string,
  data: {
    healthOperatorId: string;
    number: string;
    validUntil: string;
  },
) => {
  const response = await api.patch(`/health-plan/${id}`, data);
  return response.data;
};

// ✅ Deletar plano de saúde
export const deleteHealthPlan = async (id: string) => {
  const response = await api.delete(`/health-plan/${id}`);
  return response.data;
};

// ✅ Definir como plano primário
export const setPrimaryHealthPlan = async (id: string) => {
  const response = await api.patch(`/health-plan/set-primary/${id}`, {});
  return response.data;
};
