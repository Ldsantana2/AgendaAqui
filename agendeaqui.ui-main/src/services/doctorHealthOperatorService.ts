import api from "./api";

// 📌 Buscar operadoras associadas a um doutor
export const getOperatorsByDoctor = async (doctorId: string) => {
  try {
    const response = await api.get(`/doctor-health-operator/${doctorId}`);
    return response.data?.data || [];
  } catch (error: any) {
    console.error("❌ Erro ao buscar operadoras do doutor:", error.message);
    throw new Error("Erro ao buscar operadoras do doutor.");
  }
};

// ➕ Atribuir operadora ao doutor
export const assignOperatorToDoctor = async (
  doctorId: string,
  healthOperatorId: string,
) => {
  try {
    await api.post("/doctor-health-operator", { doctorId, healthOperatorId });
  } catch (error: any) {
    console.error("❌ Erro ao atribuir operadora:", error.message);
    throw error;
  }
};

// ➖ Remover operadora do doutor
export const removeOperatorFromDoctor = async (
  doctorId: string,
  healthOperatorId: string,
) => {
  try {
    await api.delete("/doctor-health-operator", {
      data: { doctorId, healthOperatorId },
    });
  } catch (error: any) {
    console.error("❌ Erro ao remover operadora:", error.message);
    throw error;
  }
};
