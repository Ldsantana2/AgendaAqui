"use client";
import React from "react";
import {
  FaTimes,
  FaEnvelope,
  FaCheck,
  FaTimes as FaTimesIcon,
  FaUser,
  FaPlay,
  FaClock,
  FaClipboard,
} from "react-icons/fa";
import ExamFilterModal from "./ExamFilterModal"; // ajuste o caminho conforme seu projeto

// Interfaces
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

interface Exam {
  id: string;
  name: string;
  type: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSendMessage: (appointmentId: string) => void;
  onConfirm: (appointmentId: string) => void;
  onDecline: (appointmentId: string) => void;
  onViewPatientProfile?: (patientId: string) => void;
  onStartAppointment?: (appointmentId: string) => void;
  userRole: string;
  exams?: Exam[]; // ⬅ Adicionado
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  onClose,
  onSendMessage,
  onConfirm,
  onDecline,
  onViewPatientProfile,
  onStartAppointment,
  userRole,
  exams,
}) => {
  const [showExamFilter, setShowExamFilter] = React.useState(false);
  const [selectedExams, setSelectedExams] = React.useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-[#2D39A6]">
          Detalhes da Consulta
        </h2>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Data:</div>
            <div>{formatDate(appointment.date)}</div>

            <div className="text-gray-600">Horário:</div>
            <div>{appointment.time}</div>

            <div className="text-gray-600">Especialidade:</div>
            <div>{appointment.specialty}</div>

            {appointment.location && (
              <>
                <div className="text-gray-600">Local:</div>
                <div>{appointment.location}</div>
              </>
            )}

            {userRole === "DOCTOR" && appointment.patientName && (
              <>
                <div className="text-gray-600">Paciente:</div>
                <div>{appointment.patientName}</div>
              </>
            )}

            {userRole === "PATIENT" && appointment.doctorName && (
              <>
                <div className="text-gray-600">Médico:</div>
                <div>{appointment.doctorName}</div>
              </>
            )}

            <div className="text-gray-600">Status:</div>
            <div>
              {appointment.status === "scheduled" && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
                  <FaClock className="mr-1" size={10} /> Agendado
                </span>
              )}
              {appointment.status === "confirmed" && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                  <FaCheck className="mr-1" size={10} /> Confirmado
                </span>
              )}
              {appointment.status === "canceled" && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                  <FaTimes className="mr-1" size={10} /> Cancelado
                </span>
              )}
              {appointment.status === "completed" && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center">
                  <FaClipboard className="mr-1" size={10} /> Realizado
                </span>
              )}
              {!appointment.status && (
                <span className="px-2 py-1 bg-blue-100 text-[#2D39A6] rounded-full text-xs flex items-center">
                  <FaClock className="mr-1" size={10} /> Pendente
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 mt-6">
          <button
            onClick={() => onSendMessage(appointment.id)}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaEnvelope className="mr-2" /> Mensagem
          </button>

          <button
            onClick={() => onConfirm(appointment.id)}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <FaCheck className="mr-2" /> Confirmar
          </button>

          <button
            onClick={() => onDecline(appointment.id)}
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <FaTimesIcon className="mr-2" /> Recusar
          </button>

          {userRole === "DOCTOR" &&
            appointment.patientName &&
            appointment.patientId &&
            onViewPatientProfile && (
              <button
                onClick={() => onViewPatientProfile(appointment.patientId!)}
                className="flex items-center px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                <FaUser className="mr-2" /> Ver Perfil
              </button>
            )}

          {appointment.status !== "canceled" &&
            appointment.status !== "completed" &&
            onStartAppointment && (
              <button
                onClick={() => onStartAppointment(appointment.id)}
                className="flex items-center px-3 py-2 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277]"
              >
                <FaPlay className="mr-2" /> Iniciar Atendimento
              </button>
            )}
        </div>

        {/* Botão para abrir o modal de filtro de exames */}
        <button
          onClick={() => setShowExamFilter(true)}
          className="mt-4 w-full px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Filtrar Exames
        </button>

        {/* Modal de Filtro de Exames */}
        {showExamFilter && (
          <ExamFilterModal
            exams={exams}
            selectedExams={selectedExams}
            onChange={setSelectedExams}
            onClose={() => setShowExamFilter(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
