import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../services/authService";
import { Clinic } from "../entities/Clinic";
import ClinicEditInfo from "../components/ClinicEditInfo";
import ClinicEditLocation from "../components/ClinicEditLocation";
import ClinicEditServices from "../components/ClinicEditServices";
import ClinicEditHealthOperator from "../components/ClinicEditHealthOperator";
import ClinicExams from "../components/ClinicEditExams";
import ClinicEditSpecialties from "../components/ClinicEditSpecialties";
import ClinicEditTreatedAreas from "../components/ClinicEditTreatedAreas";
import ExamSelectionModal from "../components/modal/ExamSelectionModal";
import {
  updateClinicExams,
  findAll,
  getClinicExams,
} from "../services/examService";
import { getSpecialties } from "../services/specialtyService";
import LoadingOverlay from "../components/LoadingOverlay";
import type { Specialty } from "../entities/specialty";
import { updateClinic } from "../services/ClinicService";
import { Tabs, Skeleton } from "antd";
import type { TabsProps } from "antd";
import { TreatedArea } from "../entities/TreatedArea";
import {
  getTreatedAreas,
  getClinicTreatedAreas,
} from "../services/TreatedAreasService";
import ProfileSectionCard from "../components/ProfileEditCard";

type Exam = {
  id: string;
  name: string;
};
import ProfileHeader from "./../components/ClinicProfileHeader";
import ProfileSidebar, {
  SidebarItem,
  SectionKey,
} from "../components/ProfileSidebar";

export default function ProfileClinicPage() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [clinicExams, setClinicExams] = useState<Exam[]>([]);
  const [examsList, setExamsList] = useState<Exam[]>([]);
  const [clinicSpecialties, setClinicSpecialties] = useState<Specialty[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>([]);
  const [clinicTreatedAreas, setClinicTreatedAreas] = useState<TreatedArea[]>(
    [],
  );
  const [treatedAreasList, setTreatedAreasList] = useState<TreatedArea[]>([]);
  const [currentServices, setCurrentServices] = useState<any[]>([]);
  const [currentLocations, setCurrentLocations] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("info");
  const router = useRouter();

  const handleEditImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && clinic) {
        setLoading(true);
        setError(null);
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = (reader.result as string).split(",")[1];

            const clinicToUpdate = {
              id: clinic.id,
              name: clinic.name,
              cnpj: clinic.cnpj,
              about: clinic.about ?? "",
              profileImage: base64String,
            };
            await updateClinic(clinicToUpdate);

            setClinic((prevClinic) =>
              prevClinic
                ? { ...prevClinic, profileImage: reader.result as string }
                : null,
            );
            alert("Foto de perfil atualizada com sucesso!");
          };
          reader.readAsDataURL(file);
        } catch (err: any) {
          setError(err.message || "Erro ao fazer upload da imagem.");
          console.error("Erro ao fazer upload da imagem:", err);
          alert("Erro ao fazer upload da imagem.");
        } finally {
          setLoading(false);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [clinic],
  );

  const handleViewPublicProfile = useCallback(() => {
    if (clinic?.id) router.push(`/clinic/${clinic.id}`);
  }, [clinic, router]);

  const handleViewLinkedDoctors = useCallback(() => {
    if (clinic?.id)
      router.push(
        `/linked_doctors?clinicId=${clinic.id}&clinicName=${encodeURIComponent(
          clinic.name,
        )}`,
      );
  }, [clinic, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile();

        if (!profile?.clinic) {
          setError("Os dados da clínica não foram encontrados.");
          setLoading(false);
          router.push("/login");
          return;
        }

        setClinic(profile.clinic);
        setCurrentServices(profile.clinic.services || []);
        setCurrentLocations(profile.clinic.locations || []);

        const allExams = await findAll();
        setExamsList(allExams);

        const allSpecialties = await getSpecialties();
        setSpecialtiesList(allSpecialties);
        try {
          // Busca todas as áreas tratadas disponíveis para o dropdown
          const allTreatedAreas = await getTreatedAreas();
          setTreatedAreasList(allTreatedAreas);

          // Busca as áreas tratadas associadas à clínica específica
          const clinicId = profile.clinic.id;
          const areasDaClinica = await getClinicTreatedAreas(clinicId);
          setClinicTreatedAreas(areasDaClinica);
        } catch (err) {
          console.error("Erro ao buscar áreas tratadas:", err);
          setTreatedAreasList([]); // Garante que a lista não quebre
          setClinicTreatedAreas([]); // Garante que a lista não quebre
        }

        const clinicId = profile.clinic.id;

        try {
          const clinicExamsFromApi = await getClinicExams(clinicId);
          setClinicExams(clinicExamsFromApi);
        } catch (examError) {
          console.error("Erro ao buscar exames da clínica:", examError);
        }

        if (profile.clinic.specialties) {
          setClinicSpecialties(profile.clinic.specialties);
        }
        // if (profile.clinic.treatedAreas) {
        // setClinicTreatedAreas(profile.clinic.treatedAreas);
        //}

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados");
        setLoading(false);
        router.push("/login");
      }
    }

    fetchData();
  }, [router]);

  const handleUpdateClinicInfo = (updatedData: Partial<Clinic>) => {
    setClinic((prevClinic) =>
      prevClinic ? { ...prevClinic, ...updatedData } : null,
    );
  };

  const handleUpdateServices = (updatedServices: any[]) => {
    setCurrentServices(updatedServices);
    setClinic((prevClinic) =>
      prevClinic ? { ...prevClinic, services: updatedServices } : null,
    );
  };

  const handleUpdateLocations = (updatedLocations: any[]) => {
    setCurrentLocations(updatedLocations);
    setClinic((prevClinic) =>
      prevClinic ? { ...prevClinic, locations: updatedLocations } : null,
    );
  };

  const handleExamsChange = (updatedExams: Exam[]) => {
    setClinicExams(updatedExams);
  };

  const handleEditExams = () => {
    setShowModal(true);
  };

  const handleApplyExams = async (selectedIds: string[]) => {
    try {
      if (!clinic) return;

      const updatedExamsObjects = examsList.filter((exam) =>
        selectedIds.includes(exam.id),
      );
      setClinicExams(updatedExamsObjects);
      setShowModal(false);

      if (selectedIds.length > 0) {
        await updateClinicExams(clinic.id, selectedIds);
      } else {
        await updateClinicExams(clinic.id, []);
      }
      alert("Exames atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar exames:", error);
      alert("Erro ao salvar exames da clínica.");
    }
  };

  const handleSpecialtiesChange = (updatedSpecialties: Specialty[]) => {
    setClinicSpecialties(updatedSpecialties);
    setClinic((prevClinic) =>
      prevClinic ? { ...prevClinic, specialties: updatedSpecialties } : null,
    );
  };

  const handleTreatedAreasChange = (updatedAreas: TreatedArea[]) => {
    setClinicTreatedAreas(updatedAreas);
    setClinic((prevClinic) =>
      prevClinic ? { ...prevClinic, treatedAreas: updatedAreas } : null,
    );
  };

  const sections: { key: SectionKey; label: string }[] = [
    { key: "info", label: "Sobre a clínica" },
    { key: "services", label: "Serviços oferecidos" },
    { key: "health-operators", label: "Operadores de Saúde" },
    { key: "exams", label: "Exames" },
    { key: "specialties", label: "Especialidades" },
  ];

  if (loading) return <LoadingOverlay />;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!clinic) return null;

  const clinicProfileMenuItems: SidebarItem[] = [
    { key: "info", label: "Sobre a clínica" },
    { key: "services", label: "Serviços oferecidos" },
    { key: "health-operators", label: "Operadores de Saúde" },
    { key: "exams", label: "Exames" },
    { key: "specialties", label: "Especialidades" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden;"
      style={{
        background: "#F9FAFB",
      }}
    >
      <ProfileHeader
        clinic={clinic}
        onEditImageClick={handleEditImageClick}
        onViewPublicProfile={handleViewPublicProfile}
        onViewLinkedDoctors={handleViewLinkedDoctors}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleImageFileChange}
      />

      <div className="flex flex-col sm:flex-row gap-2 px-4 mt-24 sm:mt-6 justify-start sm:justify-end items-start sm:items-center">
        <button
          className="text-[#2D39A6] hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-[#e5e7fb] transition-all flex items-center text-sm whitespace-nowrap"
          onClick={handleViewPublicProfile}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-[#2D39A6]"
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
          className="text-gray-700 hover:text-[#2D39A6] px-3 py-1.5 rounded-full bg-gray-50 hover:bg-[#e5e7fb] transition-all flex items-center text-sm whitespace-nowrap"
          onClick={handleViewLinkedDoctors}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-[#2D39A6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Médicos vinculados
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-10 mt-[20px]">
        {/* Coluna da Sidebar */}
        <div className="md:w-1/4">
          <ProfileSidebar
            activeTab={activeSection}
            onTabChange={setActiveSection}
            menuItems={clinicProfileMenuItems}
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-6">
          {activeSection === "info" && (
            <>
              <ProfileSectionCard
                title="Sobre a clínica"
                onSave={() =>
                  console.log("Salvar Info acionado no ProfileSectionCard")
                }
                onCancel={() =>
                  console.log("Cancelar Info acionado no ProfileSectionCard")
                }
              >
                {(isEditingCard, onEditStateChangeCard) => (
                  <ClinicEditInfo
                    clinic={clinic!}
                    onSave={handleUpdateClinicInfo}
                    isEditingExternally={isEditingCard}
                    onEditStateChange={onEditStateChangeCard}
                  />
                )}
              </ProfileSectionCard>

              <ProfileSectionCard
                title="Endereços da Clínica"
                onSave={() =>
                  console.log("Salvar Endereços acionado no ProfileSectionCard")
                }
                onCancel={() =>
                  console.log(
                    "Cancelar Endereços acionado no ProfileSectionCard",
                  )
                }
              >
                {(isEditingCard, onEditStateChangeCard) => (
                  <ClinicEditLocation
                    locations={currentLocations}
                    onSave={handleUpdateLocations}
                    isEditingExternally={isEditingCard}
                    onEditStateChange={onEditStateChangeCard}
                  />
                )}
              </ProfileSectionCard>
            </>
          )}

          {activeSection === "services" && (
            <ProfileSectionCard
              title="Serviços Oferecidos"
              onSave={() =>
                console.log("Salvar Serviços acionado no ProfileSectionCard")
              }
              onCancel={() =>
                console.log("Cancelar Serviços acionado no ProfileSectionCard")
              }
            >
              {(isEditingCard, onEditStateChangeCard) => (
                <ClinicEditServices
                  services={currentServices}
                  onSave={handleUpdateServices}
                  isEditingExternally={isEditingCard}
                  onEditStateChange={onEditStateChangeCard}
                />
              )}
            </ProfileSectionCard>
          )}

          {activeSection === "health-operators" && (
            <ProfileSectionCard
              title="Operadoras de Saúde"
              onSave={() =>
                console.log("Salvar Operadoras acionado no ProfileSectionCard")
              }
              onCancel={() =>
                console.log(
                  "Cancelar Operadoras acionado no ProfileSectionCard",
                )
              }
            >
              {(isEditingCard, onEditStateChangeCard) => (
                <ClinicEditHealthOperator
                  clinicId={clinic.id}
                  isEditingExternally={isEditingCard}
                  onEditStateChange={onEditStateChangeCard}
                />
              )}
            </ProfileSectionCard>
          )}

          {activeSection === "exams" && (
            <ProfileSectionCard
              title="Exames da Clínica"
              onSave={() =>
                console.log("Salvar Exames acionado no ProfileSectionCard")
              }
              onCancel={() =>
                console.log("Cancelar Exames acionado no ProfileSectionCard")
              }
            >
              {(isEditingCard, onEditStateChangeCard) => (
                <ClinicExams
                  initialExams={clinicExams}
                  onChange={handleExamsChange}
                  onEdit={handleEditExams}
                  clinicId={clinic.id}
                  isEditingExternally={isEditingCard}
                  onEditStateChange={onEditStateChangeCard}
                />
              )}
            </ProfileSectionCard>
          )}

          {activeSection === "specialties" && (
            <>
              <ProfileSectionCard
                title="Especialidades da Clínica"
                onSave={() =>
                  console.log(
                    "Salvar Especialidades acionado no ProfileSectionCard",
                  )
                }
                onCancel={() =>
                  console.log(
                    "Cancelar Especialidades acionado no ProfileSectionCard",
                  )
                }
              >
                {(isEditingCard, onEditStateChangeCard) => (
                  <ClinicEditSpecialties
                    initialSpecialties={clinicSpecialties}
                    onChange={handleSpecialtiesChange}
                    specialtiesList={specialtiesList}
                    clinicId={clinic.id}
                    isEditingExternally={isEditingCard}
                    onEditStateChange={onEditStateChangeCard}
                  />
                )}
              </ProfileSectionCard>
              <ProfileSectionCard
                title="Áreas Tratadas"
                onSave={() => console.log("Salvar Áreas Tratadas")}
                onCancel={() => console.log("Cancelar Áreas Tratadas")}
              >
                {(isEditingCard, onEditStateChangeCard) => (
                  <ClinicEditTreatedAreas
                    initialTreatedAreas={clinicTreatedAreas}
                    onChange={handleTreatedAreasChange}
                    treatedAreasList={treatedAreasList}
                    clinicId={clinic.id}
                    isEditingExternally={isEditingCard}
                    onEditStateChange={onEditStateChangeCard}
                  />
                )}
              </ProfileSectionCard>
            </>
          )}
        </div>
      </div>

      {/* Modal de seleção de exames  */}
      {showModal && (
        <ExamSelectionModal
          examsList={examsList}
          selectedExams={clinicExams.map((e) => e.id)}
          onApply={handleApplyExams}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
