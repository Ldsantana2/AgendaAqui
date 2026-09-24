"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { getProfile } from "../services/authService";
import {
  confirmAppointment,
  declineAppointment,
  sendAppointmentMessage,
} from "../services/appointmentService";
import StatusLegend from "../components/StatusLegend";
import CalendarGrid from "../components/CalendarGrid";
import AppointmentDetailsModal from "../components/modal/AppointmentDetailsModal";
import { useAlert } from "../context/AlertContext";
import {
  getAvailableSlotsByDoctor,
  getAvailableSlotsByDoctorAndDate,
} from "../services/scheduleService";
import { useSearchParams } from "next/navigation";
import { FaClock, FaCheck, FaTimes, FaClipboard } from "react-icons/fa";
import Image from "next/image";
import LoadingOverlay from "../components/LoadingOverlay";

// Define interfaces for our data structures
interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName?: string;
  doctorName?: string;
  specialty: string;
  location?: string;
  status?: "scheduled" | "confirmed" | "canceled" | "completed";
  patientId?: string;
}

// Patient interface for the patient profile popup
interface PatientHistory {
  id: string;
  patientId: string;
  patientName: string;
  photo: string;
  age: number;
  address: string;
  lastAppointment: string;
  totalAppointments: number;
  contactInfo: {
    phone: string;
    email: string;
  };
  hasAnamnesis: boolean;
  hasExams: boolean;
  hasRequests: boolean;
  anamnesisData?: string;
}

// Patient Detail component for showing patient profile
const PatientDetail: React.FC<{
  patient: PatientHistory;
  onClose: () => void;
}> = ({ patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2D39A6]">
            Ficha do Paciente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center">
            <Image
              src={patient.photo}
              alt={patient.patientName}
              width={160} // 40 * 4 (tailwind 40 = 10rem = 160px)
              height={160}
              className="rounded-full object-cover border-4 border-[#2D39A6]"
              priority
            />
            <h3 className="text-xl font-semibold mt-3 text-center">
              {patient.patientName}
            </h3>
            <p className="text-gray-600">{patient.age} anos</p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
                Informações de Contato
              </h3>
              <p className="flex items-center">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6]">
                  📱
                </span>{" "}
                {patient.contactInfo.phone}
              </p>
              <p className="mt-2 flex items-center">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6]">
                  @
                </span>{" "}
                {patient.contactInfo.email}
              </p>
              <p className="mt-2 flex items-start">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6] mt-1">
                  🏠
                </span>{" "}
                {patient.address}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
                Histórico de Consultas
              </h3>
              <p>
                Última consulta:{" "}
                <span className="font-medium">
                  {new Date(patient.lastAppointment).toLocaleDateString(
                    "pt-BR",
                  )}
                </span>
              </p>
              <p className="mt-2">
                Total de consultas:{" "}
                <span className="font-medium">{patient.totalAppointments}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock data for testing
const mockDoctorAppointments: Appointment[] = [
  {
    id: "1",
    date: "2025-04-30",
    time: "09:00",
    patientName: "Maria Souza",
    patientId: "p1",
    specialty: "Cardiologia",
    status: "scheduled",
  },
  {
    id: "2",
    date: "2025-04-30",
    time: "11:00",
    patientName: "Carlos Lima",
    patientId: "p2",
    specialty: "Ortopedia",
    status: "confirmed",
  },
  {
    id: "3",
    date: "2025-05-02",
    time: "14:00",
    patientName: "Ana Silva",
    patientId: "p3",
    specialty: "Dermatologia",
    status: "canceled",
  },
  {
    id: "4",
    date: "2025-05-05",
    time: "10:00",
    patientName: "João Pereira",
    patientId: "p4",
    specialty: "Cardiologia",
    status: "completed",
  },
];
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_BASE_ROUTE ||
  "https://agendeaqui-api-auth.onrender.com/api";

export default function CalendarPage() {
  const [role, setRole] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "biweek" | "month">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { showAlert } = useAlert();

  const [agendadas, setAgendadas] = useState([]);
  const [realizadas, setRealizadas] = useState([]);
  const [canceladas, setCanceladas] = useState([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]); // coloquei agora
  const searchParams = useSearchParams();
  const doctorIdParam = searchParams.get("doctorId");
  const availableDatesSet = new Set(availableSlots.map((slot) => slot.date)); // coloquei agora

  useEffect(() => {
    console.log(
      "🚀 useEffect foi ativado! doctorIdParam:",
      doctorIdParam,
      "data:",
      currentDate,
    );

    const fetchAvailableSlots = async () => {
      console.log("🔹 Função `fetchAvailableSlots()` chamada!");
      if (!doctorIdParam) {
        console.warn(
          "⚠ `doctorIdParam` está indefinido! Não podemos buscar horários.",
        );
        return;
      }

      try {
        const slots = await getAvailableSlotsByDoctorAndDate(
          doctorIdParam,
          format(currentDate, "yyyy-MM-dd"),
        );
        console.log(" Slots disponíveis recebidos da API:", slots);
        console.log("📌 Todos os horários retornados pela API:", slots);

        // Agora filtramos apenas horários disponíveis!
        const availableAppointments = slots.filter(
          (slot) => !slot.alreadyBooked,
        );
        console.log(
          " Horários filtrados que realmente estão disponíveis:",
          availableAppointments,
        );

        setAppointments(availableAppointments); // Agora só exibimos horários livres!
      } catch (error) {
        console.error("❌ Erro ao buscar horários disponíveis:", error);
        setAppointments([]); // Evita erro caso API falhe.
      }
    };

    fetchAvailableSlots();
  }, [doctorIdParam, currentDate]);

  function mapConfirmationStatus(status: string): Appointment["status"] {
    switch (status) {
      case "PENDING":
        return "scheduled";
      case "CONFIRMED":
        return "confirmed";
      case "DECLINED":
      case "CANCELED":
        return "canceled";
      case "COMPLETED":
        return "completed";
      default:
        return undefined;
    }
  }

  // Fetch profile and appointments
  useEffect(() => {
    const fetchUserProfileAndAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await getProfile();

        if (profile?.user) {
          const userRole = profile.user.role;

          // If user is a patient, redirect to consultations page
          if (userRole === "PATIENT") {
            router.push("/consultations");
            return;
          }

          // For doctors and clinics
          setRole(userRole);
          //setAppointments(mockDoctorAppointments);
        } else {
          // If no user profile, redirect to login
          if (!profile?.user) {
            router.push("/login");
            return;
          }
        }
        const userRole = profile.user.role;
        if (userRole === "PATIENT") {
          router.push("/consultations");
          return;
        }
        setRole(userRole);

        const clinicId = profile?.clinic?.id;
        if (!clinicId) {
          setError("Não foi possível obter o ID do médico logado.");
          setAppointments([]);
          return;
        }

        // Busca agendamentos reais do médico
        const { data } = await axios.get(
          `${API_URL}/appointment/clinic/${clinicId}`,
        );
        const mapped: Appointment[] = (data.data || []).map((item: any) => ({
          id: item.id,
          date: item.date,
          time: item.startTime,
          patientName: item.patient
            ? `${item.patient.name} ${item.patient.surname}`
            : "",
          doctorName: item.doctor
            ? `${item.doctor.name} ${item.doctor.surname}`
            : "",
          specialty:
            item.doctorService?.customName ||
            item.clinicService?.customName ||
            "",
          location:
            item.doctorLocation?.address || item.clinicLocation?.address || "",
          status: mapConfirmationStatus(item.confirmationStatus), // <- aqui você usa a função
          patientId: item.patientId,
        }));
        setAppointments(mapped);
      } catch (err: any) {
        setError("Erro ao buscar dados: " + (err?.message || ""));
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfileAndAppointments();
  }, [router]);

  // Helpers de data
  const getDateRange = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    let end;
    if (viewMode === "week") {
      end = endOfWeek(currentDate, { weekStartsOn: 0 });
    } else if (viewMode === "biweek") {
      end = endOfWeek(addWeeks(start, 1), { weekStartsOn: 0 });
    } else {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    }
    return eachDayOfInterval({ start, end });
  };
  const dateRange = getDateRange();

  // funcao getAppointements
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = format(new Date(appointment.date), "yyyy-MM-dd");
      const currentDay = format(day, "yyyy-MM-dd");
      return appointmentDate === currentDay;
    });
  };

  const goToPrevious = () => {
    if (viewMode === "week") setCurrentDate(addDays(currentDate, -7));
    else if (viewMode === "biweek") setCurrentDate(addDays(currentDate, -14));
    else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (viewMode === "week") setCurrentDate(addDays(currentDate, 7));
    else if (viewMode === "biweek") setCurrentDate(addDays(currentDate, 14));
    else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const formatHeader = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
    const start = dateRange[0];
    const end = dateRange[dateRange.length - 1];
    return `${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`;
  };

  // Modal: Detalhes do Appointment
  const handleOpenAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Popup: Detalhe do paciente (exemplo mock, adapte para seu backend real)
  const handleViewPatientProfile = async (patientId: string) => {
    try {
      const patientAppointment = appointments.find(
        (app) => app.patientId === patientId,
      );
      const patientName = patientAppointment?.patientName || "Paciente";

      // Aqui você pode buscar dados reais do paciente
      const mockPatient = {
        id: patientId,
        patientId,
        patientName,
        photo: "https://randomuser.me/api/portraits/men/44.jpg",
        age: 30,
        address: "Rua Exemplo, 123 - Salvador, BA",
        lastAppointment: new Date().toISOString(),
        totalAppointments: 4,
        contactInfo: {
          phone: "(71) 91234-5678",
          email: "paciente@email.com",
        },
        hasAnamnesis: true,
        hasExams: false,
        hasRequests: false,
        anamnesisData: "Nenhum dado relevante.",
      };

      setSelectedPatient(mockPatient);
      handleCloseModal();
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error.message ||
          "Erro ao visualizar perfil do paciente. Tente novamente.",
      );
    }
  };

  const handleClosePatientProfile = () => setSelectedPatient(null);

  // Handlers dos botões do modal
  const handleSendMessage = async (appointmentId: string) => {
    try {
      const message = "Olá, gostaria de confirmar nossa consulta.";
      await sendAppointmentMessage(appointmentId, message);
      showAlert(
        "success",
        "Mensagem enviada",
        "Sua mensagem foi enviada com sucesso.",
      );
      handleCloseModal();
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error.message || "Erro ao enviar mensagem. Tente novamente.",
      );
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await confirmAppointment(appointmentId);
      showAlert(
        "success",
        "Consulta confirmada",
        "A consulta foi confirmada com sucesso.",
      );
      handleCloseModal();
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "confirmed" } : app,
        ),
      );
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error.message || "Erro ao confirmar consulta. Tente novamente.",
      );
    }
  };

  const handleDeclineAppointment = async (appointmentId: string) => {
    try {
      await declineAppointment(appointmentId);
      showAlert(
        "success",
        "Consulta recusada",
        "A consulta foi recusada com sucesso.",
      );
      handleCloseModal();
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "canceled" } : app,
        ),
      );
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error.message || "Erro ao recusar consulta. Tente novamente.",
      );
    }
  };

  // Exemplo handler para iniciar atendimento (pode customizar conforme sua lógica)
  const handleStartAppointment = async (appointmentId: string) => {
    showAlert(
      "success",
      "Atendimento iniciado",
      "O atendimento foi iniciado com sucesso.",
    );
    handleCloseModal();
    // Aqui pode redirecionar para página de atendimento, se necessário
    // router.push(`/consultation/${appointmentId}`);
  };

  // Loading/Error
  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#2D39A6] mb-6">
        Calendário de Consultas
      </h1>

      {/* Status legend */}
      <StatusLegend />

      {/* View mode selector e status filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded ${
                viewMode === "week" ? "bg-[#2D39A6] text-white" : "bg-gray-200"
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewMode("biweek")}
              className={`px-3 py-1 rounded ${
                viewMode === "biweek"
                  ? "bg-[#2D39A6] text-white"
                  : "bg-gray-200"
              }`}
            >
              Quinzenal
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded ${
                viewMode === "month" ? "bg-[#2D39A6] text-white" : "bg-gray-200"
              }`}
            >
              Mensal
            </button>
          </div>
          {/* Status filter */}
          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 text-sm font-medium">
              Filtrar por status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Todos</option>
              <option value="scheduled">Agendado</option>
              <option value="confirmed">Confirmado</option>
              <option value="canceled">Cancelado</option>
              <option value="completed">Realizado</option>
            </select>
          </div>
        </div>
        {/* Navegação */}
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded hover:bg-gray-200"
          >
            {"<"}
          </button>
          <span className="font-medium">{formatHeader()}</span>
          <button onClick={goToNext} className="p-2 rounded hover:bg-gray-200">
            {">"}
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div
        className={`grid ${
          viewMode === "month" ? "grid-cols-7" : "grid-cols-7"
        } gap-2`}
      >
        {/* Day headers */}
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
          <div key={index} className="text-center font-medium p-2 bg-gray-100">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {dateRange.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth =
            viewMode === "month" && day.getMonth() === currentDate.getMonth();
          const isOtherMonth =
            viewMode === "month" && day.getMonth() !== currentDate.getMonth();
          const formattedDay = format(day, "yyyy-MM-dd"); // ✅ NOVO
          const isAvailable = availableDatesSet.has(formattedDay); // ✅ NOVO
          return (
            <div
              key={index}
              className={`min-h-[100px] border p-2 ${
                isOtherMonth
                  ? "bg-gray-50 text-gray-400"
                  : isCurrentMonth || viewMode !== "month"
                    ? "bg-white"
                    : "bg-gray-50"
              }`}
            >
              <div className="text-right font-medium">{format(day, "d")}</div>
              <div className="mt-1">
                {isAvailable ? (
                  dayAppointments.length > 0 ? (
                    dayAppointments.map((appointment) => {
                      let bgColorClass = "bg-blue-100";
                      let textColorClass = "text-blue-800";
                      let hoverClass = "hover:bg-blue-200";
                      let StatusIcon = FaClock;

                      switch (appointment.status) {
                        case "scheduled":
                          bgColorClass = "bg-yellow-100";
                          textColorClass = "text-yellow-800";
                          hoverClass = "hover:bg-yellow-200";
                          StatusIcon = FaClock;
                          break;
                        case "confirmed":
                          bgColorClass = "bg-green-100";
                          textColorClass = "text-green-800";
                          hoverClass = "hover:bg-green-200";
                          StatusIcon = FaCheck;
                          break;
                        case "canceled":
                          bgColorClass = "bg-red-100";
                          textColorClass = "text-red-800";
                          hoverClass = "hover:bg-red-200";
                          StatusIcon = FaTimes;
                          break;
                        case "completed":
                          bgColorClass = "bg-gray-100";
                          textColorClass = "text-gray-800";
                          hoverClass = "hover:bg-gray-200";
                          StatusIcon = FaClipboard;
                          break;
                      }

                      return (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 mb-1 rounded ${bgColorClass} ${textColorClass} truncate cursor-pointer ${hoverClass} flex items-center`}
                          onClick={() => handleOpenAppointment(appointment)}
                        >
                          {StatusIcon && (
                            <StatusIcon
                              className="mr-1 flex-shrink-0"
                              size={10}
                            />
                          )}
                          <span>
                            {appointment.time} -{" "}
                            {role === "DOCTOR"
                              ? appointment.patientName
                              : appointment.doctorName}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-green-600">Disponível</div>
                  )
                ) : (
                  <div className="text-xs text-gray-300">Indisponível</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Appointment Details Modal */}
      <CalendarGrid
        dateRange={dateRange}
        currentDate={currentDate}
        viewMode={viewMode}
        appointments={appointments}
        statusFilter={statusFilter}
        role={role}
        onOpenAppointment={handleOpenAppointment}
      />

      {/* Modal de detalhes do appointment */}
      {isModalOpen && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSendMessage={handleSendMessage}
          onConfirm={handleConfirmAppointment}
          onDecline={handleDeclineAppointment}
          onViewPatientProfile={handleViewPatientProfile}
          onStartAppointment={handleStartAppointment}
          userRole={role || ""}
        />
      )}

      {/* Popup com detalhes do paciente */}
      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={handleClosePatientProfile}
        />
      )}
    </div>
  );
}
