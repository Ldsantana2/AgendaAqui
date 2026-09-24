// src/components/ClinicViewDoctors.tsx
"use client"; // Se você estiver usando Next.js 13+ com App Router e este componente for um Client Component

import React from "react";

// Defina a interface para o Doctor conforme sua entidade ClinicDoctor
import { Specialty } from "../entities/specialty";

export interface Doctor {
  id: string;
  name: string;
  surname: string;
  specialty?: string;
  specialties?: Specialty[];
  profileImage?: string; // Assumindo que o médico pode ter uma imagem de perfil
  // Adicione outras propriedades de ClinicDoctor que você deseja exibir
}

interface ClinicViewDoctorsProps {
  doctors: Doctor[];
}

export default function ClinicViewDoctors({ doctors }: ClinicViewDoctorsProps) {
  if (!doctors || doctors.length === 0) {
    return (
      <p className="text-gray-600">Nenhum médico vinculado a esta clínica.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="border p-4 rounded-md shadow-sm bg-white flex items-center space-x-3"
        >
          {doctor.profileImage ? (
            // Se você usa Next.js Image, use-o para otimização
            <img
              src={doctor.profileImage}
              alt={`Foto de ${doctor.name} ${doctor.surname}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            // Placeholder se não houver imagem
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
              {doctor.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{doctor.name} {doctor.surname}</h3>
            {doctor.specialty && (
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            )}
            {doctor.specialties && doctor.specialties.length > 0 && (
              <p className="text-sm text-gray-600">
                {doctor.specialties.map(spec => spec.name).join(", ")}
              </p>
            )}
            {/* Adicione mais detalhes do médico aqui se desejar */}
          </div>
        </div>
      ))}
    </div>
  );
}
