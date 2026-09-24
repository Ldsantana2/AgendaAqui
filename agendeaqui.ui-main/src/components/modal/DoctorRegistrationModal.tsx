import React, { useEffect, useState } from "react";
import { message } from "antd";
import { getSpecialties } from "../../services/specialtyService";
import {
  registerClinicDoctor,
  verifyDoctorPin,
} from "../../services/ClinicService";
import { Specialty } from "../../entities/specialty";

interface DoctorRegistrationModalProps {
  clinicId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ScheduleItem {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  duration: number;
}

const DoctorRegistrationModal: React.FC<DoctorRegistrationModalProps> = ({
  clinicId,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [crm, setCrm] = useState("");
  const [email, setEmail] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cnpj, setCnpj] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { dayOfWeek: "MONDAY", startTime: "08:00", endTime: "17:00", duration: 30 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    surname?: string;
    crm?: string;
    email?: string;
    specialtyId?: string;
    schedule?: string;
    cnpj?: string;
    aboutMe?: string;
    gender?: string;
    pin?: string;
  }>({});

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getSpecialties();
        setSpecialties(data);
      } catch (err) {
        setError("Erro ao carregar especialidades");
      }
    };

    fetchSpecialties();
  }, []);

  const validateForm = () => {
    const errors: {
      name?: string;
      surname?: string;
      crm?: string;
      email?: string;
      specialtyId?: string;
      schedule?: string;
      cnpj?: string;
      aboutMe?: string;
      gender?: string;
    } = {};

    if (!name.trim()) errors.name = "Nome é obrigatório";
    if (!surname.trim()) errors.surname = "Sobrenome é obrigatório";
    if (!crm.trim()) errors.crm = "CRM é obrigatório";
    if (!email.trim()) errors.email = "Email é obrigatório";
    if (!specialtyId) errors.specialtyId = "Especialidade é obrigatória";

    // Validate schedule
    const hasInvalidSchedule = schedule.some(
      (item) =>
        !item.dayOfWeek ||
        !item.startTime ||
        !item.endTime ||
        !item.duration ||
        item.duration < 5,
    );

    if (schedule.length === 0 || hasInvalidSchedule) {
      errors.schedule =
        "Horário de trabalho é obrigatório e a duração deve ser de pelo menos 5 minutos";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSchedule = () => {
    setSchedule([
      ...schedule,
      {
        dayOfWeek: "MONDAY",
        startTime: "08:00",
        endTime: "17:00",
        duration: 30,
      },
    ]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleItem,
    value: string | number,
  ) => {
    const newSchedule = [...schedule];

    // If the field is duration, convert the value to a number
    if (field === "duration" && typeof value === "string") {
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: parseInt(value) || 30,
      };
    } else {
      newSchedule[index] = { ...newSchedule[index], [field]: value };
    }

    setSchedule(newSchedule);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const doctorData: any = {
        name,
        surname,
        crm,
        email,
        specialtyId,
        schedule,
      };

      // Add optional fields if they have values
      if (cnpj) doctorData.cnpj = cnpj;
      if (aboutMe) doctorData.aboutMe = aboutMe;
      if (gender) doctorData.gender = gender;

      await registerClinicDoctor(clinicId, doctorData);

      // Instead of closing the modal, show the PIN verification screen
      setRegistrationSuccess(true);
    } catch (err: any) {
      const backendMessage = err?.message || "";

      // Se o erro for de CRM duplicado, mostra abaixo do input
      if (backendMessage.includes("CRM")) {
        setFormErrors((prev) => ({ ...prev, crm: backendMessage }));
      } else if (backendMessage.includes("email")) {
        setFormErrors((prev) => ({ ...prev, email: backendMessage }));
      } else {
        setError(
          "Erro ao cadastrar médico. Verifique os dados e tente novamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePinCode = () => {
    const errors: { pin?: string } = {};

    if (!pinCode.trim()) {
      errors.pin = "O código PIN é obrigatório";
    } else if (pinCode.length !== 6) {
      errors.pin = "O código PIN deve ter 6 caracteres";
    }

    setFormErrors({ ...formErrors, ...errors });
    return Object.keys(errors).length === 0;
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePinCode()) return;

    setLoading(true);
    setPinError(null);

    try {
      const response = await verifyDoctorPin({
        code: pinCode,
        email: email,
      });

      // Display success message from API if available
      if (response.message) {
        message.success(response.message);
      } else {
        message.success({
          content: response.message || "Médico verificado com sucesso!",
          className:
            "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded",
        });
      }

      // PIN verification successful
      onSuccess();
      onClose();
    } catch (err: any) {
      // Use the specific error message from the API if available
      const errorMessage =
        err.message ||
        "Falha na verificação do PIN. Por favor, verifique o código e tente novamente.";
      setPinError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dayOptions = [
    { value: "MONDAY", label: "Segunda-feira" },
    { value: "TUESDAY", label: "Terça-feira" },
    { value: "WEDNESDAY", label: "Quarta-feira" },
    { value: "THURSDAY", label: "Quinta-feira" },
    { value: "FRIDAY", label: "Sexta-feira" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2D39A6]">
            {registrationSuccess ? "Verificação do Médico" : "Cadastrar Médico"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
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

        {registrationSuccess ? (
          // PIN Verification Screen
          <div>
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Cadastro realizado com sucesso!
              </p>
              <p className="mt-1">
                Um código de verificação de 6 dígitos foi enviado para o email
                do médico. Por favor, insira o código abaixo para ativar a
                conta.
              </p>
            </div>

            {pinError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {pinError}
              </div>
            )}

            <form onSubmit={handleVerifyPin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código PIN (6 dígitos)
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  maxLength={6}
                  placeholder="Digite o código de 6 dígitos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6] text-center text-lg tracking-widest"
                  disabled={loading}
                />
                {formErrors.pin && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.pin}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D39A6]"
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Registration Form
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.surname && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.surname}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CRM
                  </label>
                  <input
                    type="text"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.crm && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.crm}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidade
                  </label>
                  <select
                    value={specialtyId}
                    onChange={(e) => setSpecialtyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  >
                    <option value="">Selecione uma especialidade</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.specialtyId && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.specialtyId}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ (opcional)
                  </label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.cnpj && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.cnpj}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero (opcional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(
                        e.target.value as "male" | "female" | "other" | "",
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  >
                    <option value="">Selecione um gênero</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.gender}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobre o médico (opcional)
                  </label>
                  <textarea
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                    disabled={loading}
                  />
                  {formErrors.aboutMe && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.aboutMe}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Horário de Trabalho
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="text-[#2D39A6] hover:text-[#283277] text-sm flex items-center"
                    disabled={loading}
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
                    Adicionar Horário
                  </button>
                </div>

                {formErrors.schedule && (
                  <p className="mt-1 text-sm text-red-600 mb-2">
                    {formErrors.schedule}
                  </p>
                )}

                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap gap-2 mb-4 border border-gray-200 rounded-md p-2"
                  >
                    <div className="flex flex-col w-full sm:w-auto flex-grow">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Dia
                      </label>
                      <select
                        value={item.dayOfWeek}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "dayOfWeek",
                            e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                        disabled={loading}
                      >
                        {dayOptions.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Início
                      </label>
                      <input
                        type="time"
                        value={item.startTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "startTime",
                            e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Fim
                      </label>
                      <input
                        type="time"
                        value={item.endTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "endTime", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Duração (minutos)
                      </label>
                      <input
                        type="number"
                        min="5"
                        placeholder="30"
                        value={item.duration}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "duration",
                            e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6]"
                        disabled={loading}
                      />
                    </div>

                    {schedule.length > 1 && (
                      <div className="flex items-end pb-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveSchedule(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D39A6]"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorRegistrationModal;
