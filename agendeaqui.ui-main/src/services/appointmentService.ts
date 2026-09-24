import axios from "axios";
import { getToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName?: string;
  doctorName?: string;
  specialty: string;
  location?: string;
  status?: "scheduled" | "confirmed" | "canceled" | "completed";
  patientId?: string;
  hasReview?: boolean;
}

export const createAppointment = async (data: {
  patientId: string;
  doctorId: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorLocationId?: string;
  clinicLocationId?: string;
  doctorServiceId?: string;
  clinicServiceId?: string;
  healthPlanId?: string;
  clinicId: string;
  dataConsentSharing: boolean;
}) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");
  const formattedDate = new Date(data.date).toISOString().split("T")[0];
  const formattedTime = data.startTime.padStart(5, "0");

  const response = await axios.post(
    `${API_URL}/appointment`,
    {
      ...data,
      date: formattedDate,
      startTime: formattedTime,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const confirmAppointment = async (appointmentId: string) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.put(
    `${API_URL}/appointment/${appointmentId}/confirm`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const declineAppointment = async (appointmentId: string) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.put(
    `${API_URL}/appointment/${appointmentId}/decline`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const sendAppointmentMessage = async (
  appointmentId: string,
  message: string,
) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.post(
    `${API_URL}/appointment/${appointmentId}/message`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const getMyAppointments = async () => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.get(`${API_URL}/appointment/myAppointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Resposta da API:", response.data);

  return response.data.data;
};

export const cancelAppointment = async (appointmentId: string) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.delete(
    `${API_URL}/appointment/${appointmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const getAppointmentDetails = async (appointmentId: string) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");
  try {
    const response = await axios.get(
      `${API_URL}/appointment/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const fetchAppointmentsByDoctor = async (doctorId: string) => {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await axios.get(
    `${API_URL}/appointment/doctor/${doctorId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const rescheduleAppointment = async (
  appointmentId: string,
  newDate: string,
  newDayOfWeek: string,
  newStartTime: string,
  newDoctorId: string,
  newScheduleId: string,
) => {
  const token = getToken();
  console.log("🔹 Token recebido antes de enviar requisição:", token);
  if (!token) throw new Error("Usuário não autenticado.");
  console.log("🔹 appointmentId enviado na requisição:", appointmentId);
  console.log("🔹 Dados enviados na requisição:", {
    newDate,
    newDayOfWeek,
    newStartTime,
  });
  try {
    const weekDaysMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const newDayOfWeekNumber = weekDaysMap[newDayOfWeek];

    if (newDayOfWeekNumber === undefined) {
      console.error(
        "❌ ERRO: Dia da semana inválido! Verifique se está correto.",
      );
      return;
    }
    console.log("🔹 newDayOfWeek antes da conversão:", newDayOfWeek);
    console.log("🔹 newDayOfWeek convertido:", newDayOfWeekNumber);
    const response = await axios.put(
      `${API_URL}/appointment/${appointmentId}/reschedule`,
      {
        newDate,
        newDayOfWeek: newDayOfWeekNumber,
        newStartTime,
        doctorId: newDoctorId,
        scheduleId: newScheduleId,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "❌ ERRO AO REAGENDAR:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
