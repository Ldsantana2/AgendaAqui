"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfile } from "../services/authService";
import { createSchedule } from "../services/scheduleService";

const diasSemana = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState(
    diasSemana.map((_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "17:00",
      duration: 30,
      selected: false,
    })),
  );

  useEffect(() => {
    const fetchDoctor = async () => {
      const profile = await getProfile();
      if (profile?.doctor?.id) {
        setDoctorId(profile.doctor.id);
      } else {
        alert("Perfil de doutor não encontrado.");
        router.push("/login");
      }
    };

    fetchDoctor();
  }, [router]);

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string | number | boolean,
  ) => {
    const updated = [...selectedSlots];
    // @ts-ignore
    updated[index][field] = value;
    setSelectedSlots(updated);
  };

  const handleCreate = async () => {
    const slotsToCreate = selectedSlots.filter((s) => s.selected);
    if (!slotsToCreate.length) {
      alert("Selecione ao menos um dia com horário válido.");
      return;
    }

    try {
      const payload = {
        doctorId,
        type: "PRESENCIAL",
        address: "São Paulo, SP",
        slots: slotsToCreate.map(
          ({ dayOfWeek, startTime, endTime, duration }) => ({
            dayOfWeek,
            startTime,
            endTime,
            duration: Number(duration),
          }),
        ),
      };

      await createSchedule(payload);
      alert("Horários criados com sucesso!");
      router.push("/profile");
    } catch (error) {
      console.error("Erro ao criar horários:", error);
      alert(
        "Erro ao criar horários. Verifique se já existem horários cadastrados.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#2D39A6]">
          Configurar Horários da Semana
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedSlots.map((slot, index) => (
            <div
              key={index}
              className="border p-4 rounded flex flex-col gap-2 bg-gray-50"
            >
              <label className="font-semibold text-gray-800">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={slot.selected || false}
                  onChange={(e) =>
                    handleScheduleChange(index, "selected", e.target.checked)
                  }
                />
                {diasSemana[slot.dayOfWeek]}
              </label>

              <div className="flex gap-2 text-sm">
                <div className="flex-1">
                  <label>Início</label>
                  <input
                    type="time"
                    className="w-full border px-2 py-1 rounded"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "startTime", e.target.value)
                    }
                    disabled={!slot.selected}
                  />
                </div>
                <div className="flex-1">
                  <label>Fim</label>
                  <input
                    type="time"
                    className="w-full border px-2 py-1 rounded"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "endTime", e.target.value)
                    }
                    disabled={!slot.selected}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-sm">Duração (min)</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={slot.duration}
                  onChange={(e) =>
                    handleScheduleChange(
                      index,
                      "duration",
                      Number(e.target.value),
                    )
                  }
                  disabled={!slot.selected}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-right mt-6">
          <button
            onClick={handleCreate}
            className="bg-[#2D39A6] hover:bg-[#283277] text-white px-6 py-2 rounded"
          >
            Criar Horários
          </button>
        </div>
      </div>
    </div>
  );
}
