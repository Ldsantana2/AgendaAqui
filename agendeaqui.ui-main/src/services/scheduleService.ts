import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

// Cria uma agenda para um médico ou clínica
export const createSchedule = async (schedulePayload: {
  doctorId: string;
  type: string;
  address?: string;
  slots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    duration: number;
    doctorLocationId?: string;
    clinicLocationId?: string;
  }[];
}) => {
  const response = await axios.post(
    `${API_URL}/schedules/create`,
    schedulePayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data; // Retorna só os dados criados
};

// Busca todas as agendas de um médico
export const getSchedulesByDoctor = async (doctorId: string) => {
  const response = await axios.get(`${API_URL}/schedules/doctor/${doctorId}`);
  return response.data.data;
};

// Busca horários disponíveis por médico (N dias)
export const getAvailableSlotsByDoctor = async (
  doctorId: string,
  days = 28,
) => {
  const response = await axios.get(
    `${API_URL}/schedules/doctor/${doctorId}/available-slots`,
    {
      params: { days },
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  // O backend retorna sempre array de slots
  return response.data.data;
};

// Busca horários disponíveis por médico em um dia específico

export const getAvailableSlotsByDoctorAndDate = async (
  doctorId: string,
  date: string,
) => {
  try {
    const response = await axios.get(
      `${API_URL}/schedules/doctor/${doctorId}/available-by-date`,
      { params: { date } },
    );

    const slots = response.data.data || [];

    // Filtrar apenas horários livres (caso a API tenha essa propriedade)
    //const availableSlots = slots.filter((slot) => slot.isAvailable);

    console.log("Horários filtrados e disponíveis:", slots);
    return slots;
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error);
    return [];
  }
};

// Busca todas as agendas de uma clínica
export const getSchedulesByClinic = async (clinicId: string) => {
  const response = await axios.get(`${API_URL}/schedules/clinic/${clinicId}`);
  return response.data.data;
};

// Busca uma agenda específica por ID
export const getScheduleById = async (scheduleId: string) => {
  const response = await axios.get(`${API_URL}/schedules/${scheduleId}`);
  return response.data.data;
};

// Atualiza todas as regras/agendas de um médico
export const updateSchedulesByDoctor = async (
  doctorId: string,
  updatePayload: any,
) => {
  const response = await axios.put(
    `${API_URL}/schedules/doctor/${doctorId}`,
    updatePayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data;
};

// Deleta uma agenda
export const deleteSchedule = async (scheduleId: string) => {
  const response = await axios.delete(`${API_URL}/schedules/${scheduleId}`);
  return response.data.data;
};

export const getAvailableSlots = async (doctorId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/schedules/doctor/${doctorId}/available`,
    );
    return response.data.data; // ou response.data.data se estiver assim
  } catch (error) {
    console.error("Erro ao buscar slots disponíveis:", error);
    return [];
  }
};
