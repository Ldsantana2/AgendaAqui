"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../services/authService";
import PersonalInfo from "../components/PersonalInfo";
import SpecialtiesBox from "../components/SpecialtiesBox";
import ProfileCompletionIndicator from "../components/ProfileCompletionIndicator";
import SectionCompletionIndicator from "../components/SectionCompletionIndicator";
import { getDoctorSpecialtiesByDoctorId } from "../services/specialtyService";
import DoctorEditHealthOperator from "../components/DoctorEditHealthOperator";
import { Specialty } from "../entities/specialty";
import LoadingOverlay from "../components/LoadingOverlay";
import { getOperatorsByDoctor } from "../services/doctorHealthOperatorService";
import { Doctor } from "../entities/doctor";
import { findMockPhoto } from "./consultations";

export default function ProfilePage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorSpecialties, setDoctorSpecialties] = useState<Specialty[]>([]);
  const [doctorOperators, setDoctorOperators] = useState<any[]>([]);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      if (!profile || !profile.doctor) {
        setError("Dados do perfil não encontrados.");
        return;
      }
      console.log(
        "Doctor name:",
        `${profile.doctor.name} ${profile.doctor.surname}`,
      );
      console.log("Doctor gender:", profile.doctor.gender);
      console.log(
        "Mocked photo resolved:",
        findMockPhoto(
          `${profile.doctor.name} ${profile.doctor.surname}`,
          profile.doctor.gender,
        ),
      );
      setDoctor({
        id: profile.doctor.id,
        userId: profile.doctor.userId || "",
        name: profile.doctor.name || "",
        surname: profile.doctor.surname || "",
        crm: profile.doctor.crm || "",
        gender: profile.doctor.gender || "",
        profileImage:
          profile.doctor.profileImage ||
          findMockPhoto(
            `${profile.doctor.name || ""} ${profile.doctor.surname || ""}`.trim(),
            profile.doctor.gender,
          ),
        aboutMe: profile.doctor.aboutMe || "",
        specialties: [],
      });

      const specialties = await getDoctorSpecialtiesByDoctorId(
        profile.doctor.id,
      );
      const specialtyObjects = specialties
        .map((ds: any) => ds.specialty)
        .filter(Boolean);
      setDoctorSpecialties(specialtyObjects);

      // Fetch health operators
      const operators = await getOperatorsByDoctor(profile.doctor.id);
      setDoctorOperators(Array.isArray(operators) ? operators : []);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <LoadingOverlay />;
  if (error) return <p>{error}</p>;

  const handleViewPublicProfile = () => {
    if (doctor?.id) {
      router.push(`/doctor/${doctor.id}`);
    }
  };

  const doctorData = {
    id: doctor?.id,
    name: doctor?.name,
    surname: doctor?.surname,
    aboutMe: doctor?.aboutMe,
    gender: doctor?.gender,
    crm: doctor?.crm,
    specialties: doctorSpecialties,
    healthOperators: doctorOperators,
  };

  const derivedTitle =
    doctor?.gender === "masculino"
      ? "Dr."
      : doctor?.gender === "feminino"
        ? "Dra."
        : "Não informado";

  return (
    <div className="relative">
      <div className="bg-white-600 min-h-screen pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-[#2D39A6]">Perfil</h1>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <div className="flex-shrink-0">
                <ProfileCompletionIndicator patient={doctorData} />
              </div>
              <button
                className="flex-shrink-0 text-gray-700 hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all flex items-center text-sm whitespace-nowrap"
                onClick={handleViewPublicProfile}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Ver perfil público
              </button>
              <button
                onClick={() => router.push("/doctor_schedule")}
                className="flex-shrink-0 text-gray-700 hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all flex items-center text-sm whitespace-nowrap"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Gerar horários
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <PersonalInfo
                doctorId={doctor?.id}
                title={derivedTitle}
                name={doctor?.name || ""}
                surname={doctor?.surname || ""}
                about={doctor?.aboutMe || ""}
                gender={doctor?.gender || ""}
                profilePicture={
                  doctor?.profileImage ||
                  findMockPhoto(
                    `${doctor?.name || ""} ${doctor?.surname || ""}`.trim(),
                    doctor?.gender,
                  )
                }
                onUpdate={fetchProfile}
                completionIndicator={
                  <SectionCompletionIndicator
                    title="Informações Pessoais"
                    fields={[
                      { name: "name", value: doctor?.name },
                      { name: "surname", value: doctor?.surname },
                      { name: "gender", value: doctor?.gender },
                      { name: "aboutMe", value: doctor?.aboutMe },
                    ]}
                    showProgressBar={false}
                  />
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div>
                <SpecialtiesBox
                  doctorId={doctor?.id}
                  savedSpecialties={doctorSpecialties}
                  onUpdate={fetchProfile}
                  completionIndicator={
                    <SectionCompletionIndicator
                      title="Especialidades"
                      fields={[
                        {
                          name: "hasSpecialties",
                          value: doctorSpecialties.length > 0 ? "true" : "",
                        },
                      ]}
                      showProgressBar={false}
                    />
                  }
                />
              </div>

              <div>
                <DoctorEditHealthOperator
                  doctorId={doctor.id}
                  onUpdate={fetchProfile}
                  completionIndicator={
                    <SectionCompletionIndicator
                      title="Operadoras de Saúde"
                      fields={[
                        {
                          name: "hasOperators",
                          value: doctorOperators.length > 0 ? "true" : "",
                        },
                      ]}
                      showProgressBar={false}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
