"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Patient, getProfile } from "../services/authService";
import { updatePatient } from "../services/patientService";
import { getMyHealthPlans } from "../services/healthplanService";
import { getHealthOperators } from "../services/healthOperatorService";

import { useMessage } from "../context/MessageContext";
import ProfileCompletionIndicator from "../components/ProfileCompletionIndicator";
import SectionCompletionIndicator from "../components/SectionCompletionIndicator";
import PatientAddressEdit from "../components/PatientAddressEdit";
import MedicalHistoryEdit from "../components/MedicalHistoryEdit";
import MedicationsEdit from "../components/MedicationsEdit";
import PersonalInfoEdit from "../components/PersonalInfoEdit";
import ProfileSidebar, { SidebarItem } from "../components/ProfileSidebar";
import { AddressInfo } from "../components/PatientAddressEdit";
import HealthPlansEdit from "../components/HealthPlansEdit";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
const API_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;
export default function ProfilePatientEditPage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [healthPlans, setHealthPlans] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [planTypes, setPlanTypes] = useState<any[]>([]);
  const message = useMessage();
  const router = useRouter();

  const [form, setForm] = useState({
    number: "",
    validUntil: "",
    healthOperatorId: "",
    healthPlanTypeId: "",
  });

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({});

  const [medicalHistory, setMedicalHistory] = useState<any>({});
  const [medications, setMedications] = useState<any>({});

  const patientProfileMenuItems: SidebarItem[] = [
    { key: "personalInfo", label: "Informações pessoais" },
    { key: "address", label: "Endereço" },
    { key: "medicalHistory", label: "Histórico médico" },
    { key: "medications", label: "Medicamentos" },
    { key: "healthPlans", label: "Planos de saúde" },
  ];

  const handleTabChange = (key: string) => {
    setActiveSection(key);
  };

  const fetchData = async () => {
    try {
      const profile = await getProfile();
      if (!profile?.patient) {
        setError("Paciente não encontrado.");
        setLoading(false);
        return;
      }

      const pat = profile.patient;
      console.log("Dados do paciente:", pat);
      setPatient(pat);
      setName(pat.name || "");
      setSurname(pat.surname || "");
      setPhone(pat.phone || "");
      setCpf(pat.cpf || "");
      setGender(pat.gender || "");
      setDateOfBirth(
        pat.dateOfBirth
          ? new Date(pat.dateOfBirth).toISOString().split("T")[0]
          : "",
      );

      setAddressInfo(pat.addressInfo || {});
      setMedicalHistory(pat.medicalHistory || {});
      setMedications(pat.medications || {});

      const myPlans = await getMyHealthPlans();
      setHealthPlans(myPlans || []);

      const allOperators = await getHealthOperators();
      setOperators(allOperators);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const mapGenderToBackend = (g: string) => {
    switch (g.toLowerCase()) {
      case "masculino":
        return "male";
      case "feminino":
        return "female";
      default:
        return "other";
    }
  };

  const handleCancel = () => {
    setName("");
    setSurname("");
    setPhone("");
    setDateOfBirth("");
    setGender("");
    setCpf("");
    alert("Edição cancelada");
  };

  const handleSavePersonalInfo = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      await updatePatient(patient.id, {
        name,
        surname,
        phone: phone.replace(/\D/g, ""),
        birthDay: dateOfBirth,
        gender: mapGenderToBackend(gender),
        cpf: cpf.replace(/\D/g, ""),
      });
      message.success("Informações pessoais atualizadas!");
    } catch {
      message.error("Erro ao salvar informações pessoais.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      await updatePatient(patient.id, {
        userId: patient.userId,
        cep: addressInfo.zipCode,
        street: addressInfo.address,
        number: addressInfo.number,
        complement: addressInfo.complement,
        city: addressInfo.city,
        state: addressInfo.state,
      });
      message.success("Endereço atualizado!");
    } catch {
      message.error("Erro ao salvar endereço.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMedicalHistory = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      await axios.patch(`${API_URL}/medical-history/patient/${patient.id}`, {
        ...medicalHistory,
      });
      message.success("Histórico médico atualizado!");
    } catch {
      message.error("Erro ao salvar histórico médico.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMedications = async () => {
    if (!patient) return;
    setIsSaving(true);
    try {
      await axios.patch(`${API_URL}/medications/patient/${patient.id}`, {
        ...medications,
      });
      message.success("Medicamentos atualizados!");
    } catch {
      message.error("Erro ao salvar medicamentos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    switch (activeSection) {
      case "personalInfo":
        await handleSavePersonalInfo();
        break;
      case "address":
        await handleSaveAddress();
        break;
      case "medicalHistory":
        await handleSaveMedicalHistory();
        break;
      case "medications":
        await handleSaveMedications();
        break;
      default:
        message.error("Seção inválida para salvar.");
    }
    await fetchData();
  };

  if (loading) return <LoadingOverlay />;
  if (error) {
    return <p className="text-center text-red-600 mt-10 font-inter">{error}</p>;
  }

  const fetchAddressByCep = async (cep: string) => {
    const sanitizedCep = cep.replace(/\D/g, "");

    if (sanitizedCep.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${sanitizedCep}/json/`,
      );
      const data = await response.json();

      if (!data.erro) {
        setAddressInfo((prev) => ({
          ...prev,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-12 bg-gray-50 px-4">
      <div className="w-full mx-auto flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-64 flex-shrink-0">
          {" "}
          <ProfileSidebar
            activeTab={activeSection}
            onTabChange={handleTabChange}
            menuItems={patientProfileMenuItems}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-8">
          {" "}
          <div className="p-8 bg-gray-50  rounded-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/profile_patient")}
                  className="p-1 rounded text-[#2D39A6] hover:text-[#283277] flex items-center justify-center"
                  title="Voltar ao perfil"
                  aria-label="Voltar ao perfil"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 relative"
                    style={{ top: "-6px" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-[#2D39A6] leading-none">
                  Editar Perfil
                </h1>
              </div>
              <ProfileCompletionIndicator patient={patient} />
            </div>
            {activeSection === "personalInfo" && (
              <>
                <div className="flex justify-end w-full">
                  <SectionCompletionIndicator
                    title="Informações Pessoais"
                    fields={[
                      { name: "name", value: name },
                      { name: "surname", value: surname },
                      { name: "phone", value: phone },
                      { name: "dateOfBirth", value: dateOfBirth },
                      { name: "gender", value: gender },
                      { name: "CPF", value: cpf },
                    ]}
                  />
                </div>
                <PersonalInfoEdit
                  name={name}
                  surname={surname}
                  phone={phone}
                  dateOfBirth={dateOfBirth}
                  gender={gender}
                  cpf={cpf}
                  setName={setName}
                  setSurname={setSurname}
                  setPhone={setPhone}
                  setDateOfBirth={setDateOfBirth}
                  setGender={setGender}
                  setCpf={setCpf}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </>
            )}
            {activeSection === "address" && (
              <>
                <div className="flex justify-end w-full">
                  <SectionCompletionIndicator
                    title="Endereço"
                    fields={[
                      { name: "Endereço", value: addressInfo.address },
                      { name: "Complemento", value: addressInfo.complement },
                      { name: "CEP", value: addressInfo.zipCode },
                      { name: "Cidade", value: addressInfo.city },
                      { name: "Estado", value: addressInfo.state },
                    ]}
                  />
                </div>
                <PatientAddressEdit
                  addressInfo={addressInfo}
                  setAddressInfo={setAddressInfo}
                  onCepBlur={fetchAddressByCep}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </>
            )}
            {activeSection === "medicalHistory" && (
              <>
                <div className="flex justify-end w-full">
                  <SectionCompletionIndicator
                    title="Histórico Médico"
                    fields={Object.values(medicalHistory)
                      .filter(Boolean)
                      .map((val, idx) => ({
                        name: `Campo ${idx}`,
                        value: val,
                      }))}
                  />
                </div>
                <MedicalHistoryEdit
                  medicalHistory={medicalHistory}
                  setMedicalHistory={setMedicalHistory}
                />
              </>
            )}
            {activeSection === "medications" && (
              <>
                <div className="flex justify-end w-full">
                  <SectionCompletionIndicator
                    title="Medicamentos"
                    fields={Object.values(medications)
                      .filter(Boolean)
                      .map((val, idx) => ({
                        name: `Medicação ${idx}`,
                        value: val,
                      }))}
                  />
                </div>
                <MedicationsEdit
                  medications={medications}
                  setMedications={setMedications}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </>
            )}
            {activeSection === "healthPlans" && (
              <HealthPlansEdit patientId={patient?.id || ""} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
