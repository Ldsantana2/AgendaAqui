"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../services/authService";
import {
  getDoctorSpecialtiesByDoctorId,
  getSpecialties,
} from "../services/specialtyService";
import ProfileCompletionIndicator from "../components/ProfileCompletionIndicator";
import SectionCompletionIndicator from "../components/SectionCompletionIndicator";
import { Specialty } from "../entities/specialty";
import { Doctor } from "../entities/doctor";
import LoadingOverlay from "../components/LoadingOverlay"; // Importando o componente de overlay

export default function ProfileDoctorEditPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [specialtiesOptions, setSpecialtiesOptions] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState("");
  const [crm, setCrm] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        if (!profile?.doctor) {
          setError("Doutor não encontrado.");
          setLoading(false);
          return;
        }

        const doc = profile.doctor;
        setDoctor(doc);
        setName(doc.name || "");
        setSurname(doc.surname || "");
        setAboutMe(doc.aboutMe || "");
        setGender(doc.gender || "");
        setCrm(doc.crm || "");

        const doctorSpecs = await getDoctorSpecialtiesByDoctorId(doc.id);
        const selected = doctorSpecs
          .map((ds: any) => ds.specialty?.id)
          .filter(Boolean);

        while (selected.length < 3) selected.push("");
        setSelectedSpecialties(selected.slice(0, 3));

        const specialties = await getSpecialties();
        setSpecialtiesOptions(specialties);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados");
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    if (!doctor) {
      alert("Doutor não encontrado.");
      return;
    }

    setIsSaving(true);
    try {
      console.log("🔄 Atualizando dados do doutor...");

      alert("Perfil atualizado com sucesso!");
      router.push("/profile_doctor");
    } catch (err: any) {
      console.error("❌ Erro ao salvar:", err);
      alert("Erro ao salvar alterações: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <LoadingOverlay />
        <p className="mt-4 text-gray-600">
          Carregando informações do perfil...
        </p>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-600">{error}</p>;

  // Create a doctor object for the ProfileCompletionIndicator
  const doctorData = {
    id: doctor?.id,
    name,
    surname,
    aboutMe,
    gender,
    crm,
  };

  return (
    <div className="relative">
      <div className="min-h-screen flex flex-col items-center justify-start pt-20 pb-12 bg-gray-50 px-4">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#2D39A6]">Editar Perfil</h1>
            <div>
              <ProfileCompletionIndicator patient={doctorData} />
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2D39A6]">
                Informações Pessoais
              </h2>
              <SectionCompletionIndicator
                title="Informações Pessoais"
                fields={[
                  { name: "name", value: name },
                  { name: "surname", value: surname },
                  { name: "gender", value: gender },
                  { name: "aboutMe", value: aboutMe },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sobrenome
                </label>
                <input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  placeholder="Sobrenome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gênero
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Selecione o gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            {/* Campo Sobre mim em linha separada */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sobre mim
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
                rows={4}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </div>

          {/* Detalhes Legais */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2D39A6]">
                Detalhes Legais
              </h2>
              <SectionCompletionIndicator
                title="Detalhes Legais"
                fields={[{ name: "crm", value: crm }]}
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CRM
            </label>
            <input
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="CRM"
            />
          </div>

          {/* Especialidades */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2D39A6]">
                Especialidades
              </h2>
              <SectionCompletionIndicator
                title="Especialidades"
                fields={[
                  { name: "specialty1", value: selectedSpecialties[0] },
                  { name: "specialty2", value: selectedSpecialties[1] },
                  { name: "specialty3", value: selectedSpecialties[2] },
                ]}
              />
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidade {index + 1}
                  </label>
                  <select
                    value={selectedSpecialties[index] || ""}
                    onChange={(e) => {
                      const updated = [...selectedSpecialties];
                      updated[index] = e.target.value;
                      setSelectedSpecialties(updated);
                    }}
                    className="p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="">Selecione a especialidade</option>
                    {specialtiesOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 text-white rounded-md shadow-md ${
                isSaving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
