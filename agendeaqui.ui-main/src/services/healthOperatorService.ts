import api from "./api";

// 🔄 Buscar todos os operadores disponíveis (para dropdown)
export const getHealthOperators = async () => {
  try {
    const response = await api.get("/health-operator");
    return response.data?.data || [];
  } catch (error: any) {
    console.error("❌ Erro ao buscar operadores de saúde:", error.message);
    throw new Error("Erro ao buscar operadores de saúde.");
  }
};

// 📌 Buscar operadores associados a uma clínica
export const getOperatorsByClinic = async (clinicId: string) => {
  try {
    const response = await api.get(`/clinic-health-operator/${clinicId}`);
    return response.data?.data || [];
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
