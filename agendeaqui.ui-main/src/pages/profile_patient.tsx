"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../services/authService";
import { getMyHealthPlans } from "../services/healthplanService";
import PatientViewCard from "../components/PatientViewCard";
import type { Patient, ProfileResponse } from "../services/authService";

import PatientAddress from "../components/PatientAddress";
import MedicalHistory from "../components/MedicalHistory";
import Medications from "../components/Medications";
import ProfileSidebar, { SidebarItem } from "../components/ProfileSidebar";
import LoadingOverlay from "../components/LoadingOverlay";
import HealthPlanCarousel from "../components/HealthPlanCarousel";

interface User {
  id: string;
  email: string;
}

export default function ProfileUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [healthPlans, setHealthPlans] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<
    | "personalInfo"
    | "address"
    | "medicalHistory"
    | "medications"
    | "healthPlans"
  >("personalInfo");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile.user);
        setPatient(profile.patient);

        const myPlans = await getMyHealthPlans();
        setHealthPlans(myPlans || []);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const patientProfileMenuItems: SidebarItem[] = [
    { key: "personalInfo", label: "Informações pessoais" },
    { key: "address", label: "Endereço" },
    { key: "medicalHistory", label: "Histórico médico" },
    { key: "medications", label: "Medicamentos" },
    { key: "healthPlans", label: "Planos de saúde" },
  ];

  if (loading) return <LoadingOverlay />;
  if (error) {
    return <p className="text-center text-red-600 mt-10 font-inter">{error}</p>;
  }
  if (!patient) return null;

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden font-inter"
      style={{
        background: "#F9FAFB",
      }}
    >
      <div className="pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/4 flex-shrink-0">
              <ProfileSidebar
                activeTab={activeSection}
                onTabChange={(tabId) =>
                  setActiveSection(tabId as typeof activeSection)
                }
                menuItems={patientProfileMenuItems}
              />
            </div>
            <div className="flex-1 space-y-6">
              {activeSection === "personalInfo" && (
                <div className="bg-white p-6 rounded-md shadow-sm relative">
                  <PatientViewCard
                    name={patient.name}
                    surname={patient.surname}
                    dateOfBirth={patient.dateOfBirth}
                    gender={patient.gender}
                    profilePicture={patient.profilePicture}
                  />
                </div>
              )}

              {activeSection === "address" && (
                <PatientAddress
                  address={patient.address || ""}
                  addressInfo={patient.addressInfo || {}}
                />
              )}

              {activeSection === "medicalHistory" && (
                <MedicalHistory medicalHistory={patient.medicalHistory || {}} />
              )}

              {activeSection === "medications" && (
                <Medications medications={patient.medications || {}} />
              )}

              {activeSection === "healthPlans" && (
                <HealthPlanCarousel healthPlans={healthPlans} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
