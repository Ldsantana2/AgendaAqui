"use client";

import React from "react";
import { ClinicDoctor } from "../../entities/ClinicDoctor";

interface DoctorModalProps {
  doctor: ClinicDoctor;
  onClose: () => void;
  onVerify: (doctor: ClinicDoctor) => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onVerify,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2D39A6]">
            Informações do Médico
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {doctor.profileImage && (
            <div className="flex justify-center">
              <img
                src={doctor.profileImage}
                alt={`${doctor.name} ${doctor.surname}`}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-700">Nome</h3>
            <p>
              {doctor.name} {doctor.surname}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">CRM</h3>
            <p>{doctor.crm}</p>
          </div>

          {doctor.specialties?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700">Especialidades</h3>
              <ul className="list-disc pl-5">
                {doctor.specialties.map((specialty, index) => (
                  <li key={index}>{specialty.name}</li>
                ))}
              </ul>
            </div>
          )}

          {doctor.rating !== undefined && (
            <div>
              <h3 className="font-semibold text-gray-700">Avaliação</h3>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1 text-lg">★</span>
                <span className="text-sm">{doctor.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-700">Verificado</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                  doctor.verified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.verified ? "SIM" : "NÃO"}
              </span>

              {!doctor.verified && (
                <button
                  onClick={() => onVerify(doctor)}
                  className="px-3 py-1 bg-[#2D39A6] text-white text-xs rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-[#2D39A6] transition"
                >
                  Verificar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorModal;
