"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClinicDoctors } from "../services/ClinicService";
import { ClinicDoctor } from "../entities/ClinicDoctor";
import LoadingOverlay from "../components/LoadingOverlay";
import VerificationModal from "../components/modal/VerificationModal";
import DoctorModal from "../components/modal/DoctorModal";
import DoctorRegistrationModal from "../components/modal/DoctorRegistrationModal";
import Image from "next/image";

export default function LinkedDoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clinicId = searchParams.get("clinicId");
  const clinicName = searchParams.get("clinicName");

  const [doctors, setDoctors] = useState<ClinicDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<ClinicDoctor | null>(
    null,
  );
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [doctorToVerify, setDoctorToVerify] = useState<ClinicDoctor | null>(
    null,
  );

  const fetchDoctors = async () => {
    if (!clinicId) return;

    try {
      setLoading(true);
      const data = await getClinicDoctors(clinicId);
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar médicos vinculados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clinicId) {
      setError("ID da clínica não fornecido");
      setLoading(false);
      return;
    }

    fetchDoctors();
  }, [clinicId]);

  const handleDoctorClick = (doctor: ClinicDoctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  const handleOpenRegistrationModal = () => {
    setShowRegistrationModal(true);
  };

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false);
  };

  const handleDoctorRegistered = () => {
    fetchDoctors();
  };

  const handleVerifyDoctor = (doctor: ClinicDoctor) => {
    setDoctorToVerify(doctor);
    setSelectedDoctor(null); // Close the doctor info modal
  };

  const handleCloseVerificationModal = () => {
    setDoctorToVerify(null);
  };

  const handleVerificationSuccess = () => {
    fetchDoctors(); // Refresh the doctors list to update verification status
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div className="relative bg-white-600 min-h-screen pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#2D39A6]">
            Médicos Vinculados {clinicName && `- ${clinicName}`}
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              className="text-gray-700 hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all flex items-center text-sm"
              onClick={handleOpenRegistrationModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Cadastrar Médico
            </button>
            <button
              className="text-gray-700 hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all flex items-center text-sm"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {doctors.length === 0 && !error ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Nenhum médico vinculado encontrado.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    CRM
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Especialidade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Verificado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    onClick={() => handleDoctorClick(doctor)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {doctor.profileImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <Image
                              src={doctor.profileImage}
                              alt={`${doctor.name} ${doctor.surname}`}
                              fill
                              className="rounded-full object-cover"
                              sizes="40px"
                              priority
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">
                            {doctor.name} {doctor.surname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doctor.crm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doctor.specialties && doctor.specialties.length > 0
                        ? doctor.specialties.map((s) => s.name).join(", ")
                        : "Não especificada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doctor.verified ? "SIM" : "NÃO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          onVerify={handleVerifyDoctor}
        />
      )}

      {showRegistrationModal && clinicId && (
        <DoctorRegistrationModal
          clinicId={clinicId}
          onClose={handleCloseRegistrationModal}
          onSuccess={handleDoctorRegistered}
        />
      )}

      {doctorToVerify && (
        <VerificationModal
          doctor={doctorToVerify}
          onClose={handleCloseVerificationModal}
          onSuccess={handleVerificationSuccess}
          clinicId={clinicId || undefined}
        />
      )}
    </div>
  );
}
