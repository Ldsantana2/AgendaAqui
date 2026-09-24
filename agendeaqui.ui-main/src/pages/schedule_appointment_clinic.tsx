"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";

import { getClinic } from "../services/ClinicService";
import { getAvailableSlotsByDoctor } from "../services/scheduleService";
import { getProfile, ProfileResponse } from "../services/authService";
import { createAppointment } from "../services/appointmentService";
import { getHealthOperators } from "../services/healthOperatorService";

import { Calendar, Select, Button, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import locale from "antd/es/calendar/locale/pt_BR";

import { Clinic } from "../entities/Clinic";
import { useMessage } from "../context/MessageContext";

import LoadingOverlay from "../components/LoadingOverlay";
import BackButton from "../components/BackButton";
import ClinicInfoCard from "../components/ClinicInfoCard";
import FiltersPanel from "../components/FiltersPanel";
import CalendarSection from "../components/CalendarSection";
import SlotsPanel from "../components/SlotsPanel";

export default function ScheduleAppointmentClinicPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const messageApi = useMessage();

  const [clinic, setClinic] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [healthOperators, setHealthOperators] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [selectedHealthOperator, setSelectedHealthOperator] =
    useState<string>("");
  const [healthPlanMode, setHealthPlanMode] = useState<
    "particular" | "convenio"
  >("particular");

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [isLoginModalVisible, setIsLoginModalVisible] =
    useState<boolean>(false);
  const [isDataConsentModalVisible, setIsDataConsentModalVisible] =
    useState<boolean>(false);
  const [hasConsentedToDataSharing, setHasConsentedToDataSharing] =
    useState<boolean>(false);

  const specialtyNames = useMemo<string[]>(() => {
    if (!clinic?.doctors) return [];
    const names = (clinic.doctors as any[])
      .flatMap((doc: any) =>
        ((doc.specialties as any[]) || []).map((sp: any) => {
          const raw: string = sp.name || "";
          return raw
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        }),
      )
      .filter((n) => !!n);
    return Array.from(new Set(names));
  }, [clinic]);

  const filteredDoctors = useMemo(() => {
    if (!clinic?.doctors) return [];
    if (!selectedSpecialty) return clinic.doctors;
    return (clinic.doctors as any[]).filter((d) =>
      ((d.specialties as any[]) || []).some(
        (s) => (s.id as string) === selectedSpecialty,
      ),
    );
  }, [clinic, selectedSpecialty]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const c = await getClinic(id);
        setClinic(c);
        setServices(c.services || []);

        const profile: ProfileResponse = await getProfile();
        setUserRole(profile.user?.role || null);
        setPatientId(profile.patient?.id || null);

        const plans = (profile.patient?.healthPlans as any[]) || [];
        const primary = plans.find((p) => p.isPrimary);
        if (primary?.healthOperator?.id) {
          setSelectedHealthOperator(primary.healthOperator.id);
          setHealthPlanMode("convenio");
        } else {
          setSelectedHealthOperator("Particular");
          setHealthPlanMode("particular");
        }

        const ops = await getHealthOperators();
        setHealthOperators([
          { id: "Particular", operatorCompanyName: "Particular" },
          ...(ops || []),
        ]);
      } catch (err) {
        console.error(err);
        messageApi.error("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, messageApi]);

  useEffect(() => {
    if (selectedDoctorId) {
      getAvailableSlotsByDoctor(selectedDoctorId).then((s) =>
        setAvailableSlots(s || []),
      );
    } else {
      setAvailableSlots([]);
    }
    setSelectedDate(null);
    setSelectedSlotId(null);
  }, [selectedDoctorId]);

  const handleBook = async () => {
    if (!userRole) {
      setIsLoginModalVisible(true);
      return;
    }
    if (userRole !== "PATIENT") {
      messageApi.error("Apenas pacientes podem agendar.");
      return;
    }
    if (!hasConsentedToDataSharing) {
      messageApi.warning(
        "É necessário consentir com o compartilhamento de dados para agendar.",
      );
      return;
    }
    if (
      !selectedSlotId ||
      !patientId ||
      !selectedService ||
      !selectedDoctorId
    ) {
      messageApi.warning("Preencha todos os campos.");
      return;
    }
    const slot = availableSlots.find(
      (s) => `${s.date}-${s.startTime}` === selectedSlotId,
    );
    if (!slot) {
      messageApi.error("Horário inválido.");
      return;
    }
    try {
      await createAppointment({
        patientId,
        doctorId: selectedDoctorId,
        scheduleId: slot.scheduleId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        clinicLocationId: clinic.locations?.[0]?.id,
        clinicServiceId: selectedService,
        healthPlanId:
          healthPlanMode === "convenio" ? selectedHealthOperator : undefined,
        clinicId: clinic.id,
        dataConsentSharing: hasConsentedToDataSharing,
      });
      messageApi.success("Agendado com sucesso!");
      router.push(`/clinic/${id}`);
    } catch (err) {
      console.error(err);
      messageApi.error("Erro ao agendar.");
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!clinic)
    return <p className="text-center mt-8">Clínica não encontrada.</p>;

  const slotsForSelectedDate =
    selectedDate && Array.isArray(availableSlots)
      ? availableSlots.filter((slot) =>
          dayjs(slot.date).isSame(selectedDate, "day"),
        )
      : [];

  const slotsMorning = slotsForSelectedDate.filter(
    (slot) => Number(slot.startTime.split(":")[0]) < 13,
  );
  const slotsAfternoon = slotsForSelectedDate.filter(
    (slot) => Number(slot.startTime.split(":")[0]) >= 13,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <BackButton href={`/clinic/${id}`} />
      <div className="container mx-auto p-4 flex lg:flex-row gap-4">
        <div className="lg:w-2/3 flex flex-col gap-4">
          <ClinicInfoCard clinic={clinic} specialties={specialtyNames} />
          <FiltersPanel
            healthOperators={healthOperators}
            selectedHealthOperator={selectedHealthOperator}
            onHealthOperatorChange={setSelectedHealthOperator}
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            allSpecialties={specialtyNames.map((name) => ({ id: name, name }))}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            doctors={filteredDoctors}
            selectedDoctorId={selectedDoctorId}
            onDoctorChange={setSelectedDoctorId}
          />
        </div>
        <div className="lg:w-1/3 bg-white rounded shadow p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Datas Disponíveis</h3>
          <CalendarSection
            value={selectedDate}
            onSelect={setSelectedDate}
            availableSlots={availableSlots}
          />
          <div className="mt-6 flex-1 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Horários Disponíveis
            </h2>
            {selectedDate ? (
              slotsForSelectedDate.length === 0 ? (
                <div className="text-gray-500 text-sm mb-4">
                  Nenhum horário disponível para esta data.
                </div>
              ) : (
                <>
                  {slotsMorning.length > 0 && (
                    <div className="mb-4">
                      <div className="font-semibold text-gray-600 mb-1">
                        Manhã
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slotsMorning.map((slot) => {
                          const uniqueSlotId = `${slot.date}-${slot.startTime}`;
                          return (
                            <button
                              key={uniqueSlotId}
                              onClick={() => setSelectedSlotId(uniqueSlotId)}
                              disabled={slot.appointments?.length > 0}
                              className={`text-xs rounded p-2 text-center shadow border ${
                                slot.appointments?.length > 0
                                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                  : selectedSlotId === uniqueSlotId
                                    ? "bg-[#2D39A6] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-[#2D39A6] hover:text-white"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {slotsAfternoon.length > 0 && (
                    <div>
                      <div className="font-semibold text-gray-600 mb-1">
                        Tarde
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slotsAfternoon.map((slot) => {
                          const uniqueSlotId = `${slot.date}-${slot.startTime}`;
                          return (
                            <button
                              key={uniqueSlotId}
                              onClick={() => setSelectedSlotId(uniqueSlotId)}
                              disabled={slot.appointments?.length > 0}
                              className={`text-xs rounded p-2 text-center shadow border ${
                                slot.appointments?.length > 0
                                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                  : selectedSlotId === uniqueSlotId
                                    ? "bg-[#2D39A6] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-[#2D39A6] hover:text-white"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="text-gray-500 text-sm mb-4">
                Selecione uma data para ver os horários.
              </div>
            )}
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="dataConsent"
                  checked={hasConsentedToDataSharing}
                  onChange={(e) =>
                    setHasConsentedToDataSharing(e.target.checked)
                  }
                  className="mr-2"
                />
                <label htmlFor="dataConsent" className="text-sm text-gray-700">
                  Concordo em{" "}
                  <span
                    className="text-[#2D39A6] cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDataConsentModalVisible(true);
                    }}
                  >
                    compartilhar meus dados
                  </span>{" "}
                  para agendamento da consulta
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleBook}
                  className="bg-[#2D39A6] hover:bg-[#283277]text-white px-4 py-2 rounded"
                >
                  Agendar Consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <Modal
        title="Faça login para continuar"
        open={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
      >
        <p className="mb-4">
          Você precisa fazer o login para realizar agendamentos.
        </p>
        <div className="flex justify-between">
          <Button type="primary" onClick={() => router.push("/login")}>
            Fazer Login
          </Button>
          <Button onClick={() => router.push("/cadastro")}>Cadastrar-se</Button>
        </div>
      </Modal>
      <Modal
        title="Consentimento para Compartilhamento de Dados"
        open={isDataConsentModalVisible}
        onCancel={() => setIsDataConsentModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setIsDataConsentModalVisible(false)}
          >
            Entendi
          </Button>,
        ]}
        width={700}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px" }}>
          <h3 className="font-bold mb-2">Quais dados serão compartilhados:</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Dados pessoais: nome completo, CPF, telefone e e-mail</li>
            <li>Dados de saúde: plano de saúde (se aplicável)</li>
            <li>Informações da consulta: data, horário e especialidade</li>
          </ul>
          <h3 className="font-bold mb-2">Como seus dados serão utilizados:</h3>
          <p className="mb-4">
            Seus dados serão utilizados exclusivamente para fins de agendamento,
            confirmação e realização da consulta médica. A clínica e o
            profissional de saúde terão acesso a estas informações para garantir
            o atendimento adequado.
          </p>
          <h3 className="font-bold mb-2">Proteção de dados:</h3>
          <p className="mb-4">
            Seus dados são protegidos de acordo com a Lei Geral de Proteção de
            Dados (LGPD) e utilizamos medidas técnicas e organizacionais para
            garantir a segurança das suas informações pessoais.
          </p>
          <h3 className="font-bold mb-2">Seus direitos:</h3>
          <p className="mb-4">
            Você tem o direito de acessar, corrigir, atualizar e solicitar a
            exclusão dos seus dados pessoais a qualquer momento, conforme
            previsto na LGPD.
          </p>
          <h3 className="font-bold mb-2">Tempo de retenção:</h3>
          <p>
            Seus dados serão mantidos pelo tempo necessário para cumprir as
            finalidades para as quais foram coletados, incluindo obrigações
            legais, contratuais, de prestação de contas ou requisição de
            autoridades competentes.
          </p>
        </div>
      </Modal>

      <style jsx global>{`
        .ant-picker-calendar-header {
          justify-content: center !important;
        }
        .ant-picker-calendar,
        .ant-picker-panel {
          margin-bottom: 0 !important;
        }
        .ant-picker-cell-inner {
          pointer-events: none !important;
        }
        .ant-picker-calendar-date {
          cursor: default !important;
        }
      `}</style>
    </div>
  );
}
