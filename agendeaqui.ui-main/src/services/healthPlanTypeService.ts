import api from "./api";

// ✅ Buscar tipos de plano de saúde por operador
export const getHealthPlanTypesByOperator = async (operatorId: string) => {
  try {
    const response = await api.get(
      `/health-plan-type/by-operator/${operatorId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar planos da operadora:", error.message);
    throw new Error("Erro ao buscar planos da operadora.");
  }
};
