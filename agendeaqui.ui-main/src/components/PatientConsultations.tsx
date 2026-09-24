"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { cancelAppointment } from "../services/appointmentService";
import ReviewForm from "../components/ReviewForm";
import { Review } from "../entities/Review";

export interface Consultation {
  id: string;
  patientId: string;
  doctor: {
    id: string;
    name?: string;
    surname?: string;
    gender?: string;
    specialtyLinks?: Array<{ specialty: { name: string } }>;
  };
  doctorName: string;
  doctorPhoto: string;
  doctorSpecialty: string;
  date: string;
  startTime: string;
  endTime?: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhoto: string;
  clinicLocation: {
    id: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    number: string;
    complement?: string;
    clinicId?: string;
    clinic?: {
      id: string;
      name?: string;
      photo?: string;
    };
  };
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "DECLINED" | "CANCELED";
  hasReview?: boolean;
  review?: {
    id: string;
    rating?: number;
    comment?: string;
  };
}

interface Props {
  consultations: Consultation[];
  onAppointmentActionComplete: () => void;
}

const traduzirStatus = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "Agendada";
    case "COMPLETED":
      return "Realizada";
    case "CANCELED":
      return "Cancelada";
    case "PENDING":
      return "Pendente";
    case "DECLINED":
      return "Recusada";
    default:
      return status;
  }
};

const PatientConsultations: React.FC<Props> = ({
  consultations = [],
  onAppointmentActionComplete,
}) => {
  const [activeTab, setActiveTab] = useState("CONFIRMED");
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [appointmentToCancelId, setAppointmentToCancelId] = useState<
    string | null
  >(null);
  const [alert, setAlert] = useState({ type: null, message: null });

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: null }), 5000);
  };

  const handleOpenCancelModal = (id: string) => {
    setAppointmentToCancelId(id);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setAppointmentToCancelId(null);
    setIsCancelModalOpen(false);
  };

  const confirmarCancelarConsulta = async () => {
    if (!appointmentToCancelId) return;
    try {
      await cancelAppointment(appointmentToCancelId);
      showAlert("success", "Consulta cancelada com sucesso!");
      handleCloseCancelModal();
      onAppointmentActionComplete();
    } catch {
      showAlert("error", "Erro ao cancelar consulta. Tente novamente.");
      handleCloseCancelModal();
    }
  };

  const filtered = consultations.filter((c) =>
    activeTab === "CONFIRMED"
      ? ["CONFIRMED", "PENDING"].includes(c.status)
      : c.status === activeTab,
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold" style={{ color: "#2D39A6" }}>
        Minhas Consultas
      </h1>
      {alert.type && (
        <div
          className={`p-3 mb-4 rounded-md ${alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["CONFIRMED", "COMPLETED", "CANCELED"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2"
                : "text-gray-500 hover:text-[#2D39A6]"
            }`}
            style={
              activeTab === tab
                ? { color: "#2D39A6", borderColor: "#2D39A6" }
                : {}
            }
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === "CONFIRMED"
              ? "Agendadas"
              : tab === "COMPLETED"
                ? "Realizadas"
                : "Canceladas"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((consultation) => (
            <div
              key={consultation.id}
              className="relative border border-gray-300 rounded-lg p-4 bg-white"
            >
              {/* Status no topo direito (desktop) */}
              {activeTab === "COMPLETED" && (
                <span className="absolute top-4 right-4 text-base font-base px-2 py-1 rounded bg-[#E2FBE8] text-[#306339] hidden sm:block">
                  {traduzirStatus(consultation.status)}
                </span>
              )}
              <div className="flex sm:flex-row flex-col gap-1 items-start">
                <div className="mr-4">
                  <img
                    src="/images/laboratoryMan.jpg"
                    alt={consultation.clinicName}
                    className="sm:w-20 sm:h-20 h-16 w-16 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3
                    className="font-bold flex items-center mb-3 text-base sm:text-lg md:text-xl"
                    style={{ color: "#2D39A6" }}
                  >
                    {consultation.clinicName}
                  </h3>

                  <p
                    className="text-sm sm:text-base mb-2 font-medium flex gap-2 items-center"
                    style={{ color: "#2D39A6" }}
                  >
                    <Image
                      src="/images/locationIcon.svg"
                      alt="location"
                      width={14}
                      height={14}
                    />
                    <span className="font-normal">
                      {consultation.clinicAddress}
                    </span>
                  </p>

                  <p
                    className="text-sm sm:text-base mt-4 gap-2 flex items-center"
                    style={{ color: "#2D39A6" }}
                  >
                    <Image
                      src="/images/userIcon.svg"
                      alt="user icon"
                      width={16}
                      height={16}
                    />
                    <span className="font-normal">
                      {consultation.doctorName}
                    </span>
                  </p>

                  <div className="flex mt-3 gap-4 text-sm sm:text-base">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: "#2D39A6" }}
                    >
                      <Image
                        src="/images/calendarIcon.svg"
                        alt="calendar"
                        width={18}
                        height={18}
                      />
                      {consultation.date}
                    </span>
                    <span
                      className="flex items-center gap-2"
                      style={{ color: "#2D39A6" }}
                    >
                      <Image
                        src="/images/clockIcon.svg"
                        alt="clock"
                        width={18}
                        height={18}
                      />
                      {consultation.startTime}
                      {consultation.endTime ? ` - ${consultation.endTime}` : ""}
                    </span>
                  </div>

                  {/* Status abaixo da data (mobile) */}
                  {activeTab === "COMPLETED" && (
                    <p className="block mt-4 sm:hidden text-sm font-meium px-2 py-1 rounded-lg bg-[#E2FBE8] text-[#306339] w-max">
                      {traduzirStatus(consultation.status)}
                    </p>
                  )}

                  {activeTab === "COMPLETED" && (
                    <div className="mt-8">
                      <ReviewForm
                        patientId={consultation.patientId}
                        clinicId={
                          consultation.clinicLocation?.clinicId ||
                          consultation.clinicLocation?.clinic?.id ||
                          ""
                        }
                        appointmentId={consultation.id}
                        review={consultation.review}
                        onReviewSuccess={onAppointmentActionComplete}
                      />
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {(consultation.status === "CONFIRMED" ||
                    consultation.status === "PENDING") && (
                    <div className="flex flex-col space-y-2">
                      <button
                        className="px-3 py-1 text-sm text-white rounded hover:bg-[#1e2a88]"
                        style={{ backgroundColor: "#2D39A6" }}
                        onClick={() => {
                          const id =
                            consultation.clinicLocation?.clinicId ||
                            consultation.clinicLocation?.clinic?.id;
                          id
                            ? router.push(
                                `/schedule_appointment_clinic?id=${id}&appointmentId=${consultation.id}`,
                              )
                            : showAlert(
                                "error",
                                "Não foi possível encontrar o ID da clínica para remarcar.",
                              );
                        }}
                      >
                        Remarcar
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-white text-black border border-gray-300 rounded hover:bg-gray-100"
                        onClick={() => {
                          const id =
                            consultation.clinicLocation?.clinicId ||
                            consultation.clinicLocation?.clinic?.id;
                          id
                            ? router.push(`/clinic/${id}`)
                            : showAlert(
                                "error",
                                "Não foi possível encontrar o ID da clínica para ver o perfil.",
                              );
                        }}
                      >
                        Perfil
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleOpenCancelModal(consultation.id)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-3 py-1 text-sm text-white rounded hover:bg-[#1e2a88]"
                        style={{ backgroundColor: "#2D39A6" }}
                        onClick={() =>
                          router.push(
                            `/messages?appointmentId=${consultation.id}`,
                          )
                        }
                      >
                        Enviar Mensagem
                      </button>
                    </div>
                  )}

                  {activeTab === "CANCELED" && (
                    <div className="flex flex-col space-y-2">
                      <button
                        className="px-3 py-1 text-sm text-white rounded hover:bg-[#1e2a88]"
                        style={{ backgroundColor: "#2D39A6" }}
                        onClick={() => {
                          const id =
                            consultation.clinicLocation?.clinicId ||
                            consultation.clinicLocation?.clinic?.id;
                          id
                            ? router.push(
                                `/schedule_appointment_clinic?id=${id}&appointmentId=${consultation.id}`,
                              )
                            : showAlert(
                                "error",
                                "Não foi possível encontrar o ID da clínica para remarcar.",
                              );
                        }}
                      >
                        Remarcar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "CONFIRMED"
                ? "Você não possui consultas agendadas."
                : activeTab === "COMPLETED"
                  ? "Você não possui consultas realizadas."
                  : "Você não possui consultas canceladas."}
            </p>
          </div>
        )}
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Confirmar Cancelamento
            </h2>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={handleCloseCancelModal}
              >
                Não, Manter
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmarCancelarConsulta}
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientConsultations;
