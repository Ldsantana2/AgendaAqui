import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Importação do Next Image
import {
  FaComments,
  FaFileMedical,
  FaClipboardList,
  FaPhone,
  FaFileAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getToken, getProfile } from "../services/authService";
import { getPatients, PaginationParams } from "../services/patientService";
import { OwnerPatient } from "../entities/DoctorPatient";
import { getOperatorsByClinic } from "../services/clinicHealthOperatorService";
import LoadingOverlay from "../components/LoadingOverlay";

interface PatientDetailProps {
  patient: OwnerPatient;
  onClose: () => void;
  userRole: string | null;
}

const PatientDetail: React.FC<PatientDetailProps> = ({
  patient,
  onClose,
  userRole,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2D39A6]">
            Ficha do Paciente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center">
            <Image
              src={"/images/do-utilizador.png"}
              alt={patient.patientName}
              width={160}
              height={160}
              className="rounded-full border-4 border-[#2D39A6]"
              style={{ objectFit: "cover" }}
              priority
            />
            <h3 className="text-xl font-semibold mt-3 text-center">
              {patient.patientName}
            </h3>
            <p className="text-gray-600">{patient.age} anos</p>
            <p className="text-gray-600">
              {patient.gender == "male"
                ? "Homem"
                : patient.gender == "female"
                  ? "Mulher"
                  : "Outro"}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
                Informações pessoais
              </h3>
              <p className="mt-2 flex items-start">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6] mt-1">
                  🪪
                </span>{" "}
                {patient.cpf.slice(-2).padStart(patient.cpf.length, "*")}
              </p>
              <p className="flex items-center">
                <FaPhone className="inline mr-2 text-[#2D39A6]" />{" "}
                {patient.contactInfo.phone}
              </p>
              <p className="mt-2 flex items-center">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6]">
                  @
                </span>{" "}
                {patient.contactInfo.email}
              </p>
              <p className="mt-2 flex items-start">
                <span className="inline-block w-5 mr-2 text-center text-[#2D39A6] mt-1">
                  🏠
                </span>{" "}
                <div className="text-gray-600 text-sm">
                  {patient.address?.city && patient.address?.state ? (
                    <>
                      <p>
                        {patient.address.city}{" "}
                        {patient.address.number ? patient.address.number : null}
                      </p>
                      {patient.address.complement && (
                        <p>{patient.address.complement}</p>
                      )}
                      <p>{patient.address.state}</p>
                      {patient.address.cep && <p>CEP: {patient.address.cep}</p>}
                    </>
                  ) : (
                    <p>Endereço não informado</p>
                  )}
                </div>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
                Histórico de Consultas
              </h3>
              <p>
                Última consulta:{" "}
                <span className="font-medium">
                  {new Date(patient.lastAppointment).toLocaleDateString(
                    "pt-BR",
                  )}
                </span>
              </p>
              <p className="mt-2">
                Total de consultas:{" "}
                <span className="font-medium">{patient.totalAppointments}</span>
              </p>
            </div>
          </div>
        </div>
        {userRole !== "CLINIC" && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-[#2D39A6] border-b pb-2">
              Histórico Médico
            </h3>
            <div className="bg-gray-50 p-4 rounded shadow-sm relative">
              <div className={expanded ? "" : "max-h-5 overflow-hidden"}>
                <p className="font-medium">
                  Medicações:
                  {patient.medications?.currentMedications?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {patient.medications.currentMedications.map(
                        (med, index) => (
                          <li key={index}>{med}</li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Não informado</p>
                  )}
                </p>
                <p className="font-medium">
                  Medicações Passadas:
                  {patient.medications?.pastMedications?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {patient.medications.pastMedications.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Não informado</p>
                  )}
                </p>
                <p>
                  Alergias:{" "}
                  {patient.medicalHistory?.allergies || (
                    <span className="text-gray-400 text-sm">Não informado</span>
                  )}
                </p>
                <p>
                  Doenças crônicas:{" "}
                  {patient.medicalHistory?.chronicDiseases || (
                    <span className="text-gray-400 text-sm">Não informado</span>
                  )}
                </p>
                <p>
                  Doenças passadas:{" "}
                  {patient.medicalHistory?.pastDiseases || (
                    <span className="text-gray-400 text-sm">Não informado</span>
                  )}
                </p>
                <p>
                  Doenças graves na família:{" "}
                  {patient.medicalHistory?.familySeriousDiseases || (
                    <span className="text-gray-400 text-sm">Não informado</span>
                  )}
                </p>
              </div>
              <div className="text-right mt-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-[#2D39A6] hover:underline"
                >
                  {expanded ? "Ver menos" : "Ver mais"}
                </button>
              </div>
            </div>
          </div>
        )}
        {userRole !== "CLINIC" && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-[#2D39A6] border-b pb-2">
              Documentação Médica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded shadow-sm ${
                  patient.hasAnamnesis
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <FaFileAlt
                    className={`mr-2 ${patient.hasAnamnesis ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="font-medium">Anamnese</span>
                </div>
                <p className="text-sm mt-2">
                  {patient.hasAnamnesis ? "Disponível" : "Não disponível"}
                </p>
              </div>

              <div
                className={`p-4 rounded shadow-sm ${
                  patient.hasExams
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <FaFileMedical
                    className={`mr-2 ${patient.hasExams ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <span className="font-medium">Exames</span>
                </div>
                <p className="text-sm mt-2">
                  {patient.hasExams ? "Disponível" : "Não disponível"}
                </p>
              </div>

              <div
                className={`p-4 rounded shadow-sm ${
                  patient.hasRequests
                    ? "bg-orange-50 border-l-4 border-orange-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <FaClipboardList
                    className={`mr-2 ${patient.hasRequests ? "text-orange-600" : "text-gray-400"}`}
                  />
                  <span className="font-medium">Solicitações</span>
                </div>
                <p className="text-sm mt-2">
                  {patient.hasRequests ? "Disponível" : "Não disponível"}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Link
            href={`/messages?patient=${patient.patientId}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition-colors"
          >
            <FaComments className="mr-2" /> Enviar Mensagem
          </Link>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PatientsPage() {
  const router = useRouter();

  const [patientHistories, setPatientHistories] = useState<OwnerPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<OwnerPatient | null>(
    null,
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Sorting state
  const [sortBy, setSortBy] = useState("patientName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterAge, setAgeFilter] = useState<string | null>(null);
  const [filterGender, setGenderFilter] = useState<string | null>(null);
  const [patientHealthOperatorId, setPatientHealthOperatorId] = useState<
    string | null
  >(null);
  const [ownerHealthOperators, setOwnerHealthOperators] = useState<any | null>(
    null,
  );
  const [patients, setPatients] = useState<OwnerPatient[] | null>(null);

  // Items per page options
  const itemsPerPageOptions = [10, 25, 50, 100];

  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();

      if (profile.clinic !== null) {
        setClinicId(profile.clinic.id);
      }

      if (!profile.clinic) {
        setError("clinica não encontrada");
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOwnerOperators = async () => {
      if (clinicId) {
        const ops = await getOperatorsByClinic(clinicId);
        setOwnerHealthOperators(ops || []);
      }
    };
    fetchOwnerOperators();
  }, [clinicId]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Get profile clinic or profile doctor

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!clinicId) return;

      setIsLoading(true);
      try {
        const params: PaginationParams = {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchTerm,
          sortBy,
          sortOrder,
        };

        let result = await getPatients(params, `clinic id ${clinicId}`);
        if (!result) throw new Error("Não foi possível obter os pacientes");

        let patients: OwnerPatient[] = result.data;

        // Ordenar por data da última consulta
        patients = [...patients].sort((a, b) => {
          const dateA = new Date(a.lastAppointment || 0).getTime();
          const dateB = new Date(b.lastAppointment || 0).getTime();
          return dateB - dateA; // Ordem decrescente (mais recente primeiro)
        });

        // Filtros locais
        if (filterAge) {
          if (filterAge === "0-18")
            patients = patients.filter((p) => p.age > 0 && p.age <= 18);
          else if (filterAge === "19-35")
            patients = patients.filter((p) => p.age >= 19 && p.age <= 35);
          else if (filterAge === "36-60")
            patients = patients.filter((p) => p.age >= 36 && p.age <= 60);
          else if (filterAge === "60+")
            patients = patients.filter((p) => p.age > 60);
        }

        if (filterGender) {
          patients = patients.filter(
            (patient) =>
              patient.gender?.toUpperCase() === filterGender.toUpperCase(),
          );
        }

        if (patientHealthOperatorId) {
          patients = patients.filter(
            (p) => p.healthOperatorId === patientHealthOperatorId,
          );
        }

        setPatientHistories(patients);
        setPagination((p) => ({
          ...p,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [
    patientHealthOperatorId,
    filterAge,
    filterGender,
    clinicId,
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
  ]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const profile = await getProfile();
        if (profile?.user) {
          const role = profile.user.role;
          setUserRole(role);

          if (role !== "CLINIC") {
            router.push("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  // Handle items per page change
  const handleLimitChange = (newLimit: number) => {
    setPagination({ ...pagination, page: 1, limit: newLimit });
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientClick = (patient: OwnerPatient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDetail = () => {
    setSelectedPatient(null);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#2D39A6] mb-4">Pacientes</h1>

      {/* Search and filter section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <select
            value={filterAge}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Todas idades</option>
            <option value="0-18">0-18 anos</option>
            <option value="19-35">19-35 anos</option>
            <option value="36-60">36-60 anos</option>
            <option value="60+">Mais de 60</option>
          </select>

          {/* Filtro por gênero */}
          <select
            value={filterGender || ""}
            onChange={(e) => {
              setGenderFilter(e.target.value);
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option key={""} value="">
              Todos os gêneros
            </option>
            <option key={"MALE"} value="MALE">
              Masculino
            </option>
            <option key={"FEMALE"} value="FEMALE">
              Feminino
            </option>
            <option key={"OTHER"} value="OTHER">
              Outro
            </option>
          </select>

          {/* Filtro por plano */}
          <select
            value={patientHealthOperatorId}
            onChange={(e) => setPatientHealthOperatorId(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Todos os operadores de planos de saúde</option>
            {ownerHealthOperators &&
              ownerHealthOperators.map((healthOperator) => (
                <option
                  key={healthOperator.healthOperatorId}
                  value={healthOperator.healthOperatorId}
                >
                  {healthOperator.healthOperator.operatorCompanyName}
                </option>
              ))}
          </select>

          <div className="flex items-center">
            <label
              htmlFor="itemsPerPage"
              className="mr-2 text-gray-700 whitespace-nowrap"
            >
              Itens por página:
            </label>
            <select
              id="itemsPerPage"
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Mostrando {patientHistories.length} de {pagination.total} pacientes
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientHistories.map((patient) => (
          <div
            key={patient.patientId}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handlePatientClick(patient)}
          >
            <div className="flex items-center p-4 border-b">
              <Image
                src={"/images/do-utilizador.png"}
                alt={patient.patientName}
                width={64}
                height={64}
                className="rounded-full border-2 border-[#2D39A6] mr-4"
                style={{ objectFit: "cover" }}
                priority={false}
              />
              <div>
                <h3 className="font-semibold text-lg text-[#2D39A6]">
                  {patient.patientName}
                </h3>
                <p className="text-gray-600 text-sm">{patient.age} anos</p>
                <p className="text-gray-600 text-sm">
                  {patient.gender == "male"
                    ? "Homem"
                    : patient.gender == "female"
                      ? "Mulher"
                      : "Outro"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50">
              <div className="flex items-start text-sm mb-2">
                <span className="text-[#2D39A6] mr-2 mt-1">CPF:</span>
                <span className="line-clamp-1">
                  {patient.cpf.slice(-2).padStart(patient.cpf.length, "*")}
                </span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <FaPhone className="text-[#2D39A6] mr-2" />
                <span>{patient.contactInfo.phone}</span>
              </div>

              <div className="flex items-start text-sm mb-2">
                <span className="text-[#2D39A6] mr-2 mt-1">
                  Tipo de atendimento:
                </span>
                <span className="line-clamp-1">
                  {patient.healthPlan === undefined
                    ? "Atendimento Privado"
                    : patient.healthPlan}{" "}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <span className="text-[#2D39A6] mr-2 mt-1">
                  Última consulta:
                </span>
                <span className="font-medium">
                  {new Date(patient.lastAppointment).toLocaleDateString(
                    "pt-BR",
                  )}
                </span>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-white border-t">
              <div className="flex space-x-2">
                {patient.hasAnamnesis && (
                  <FaFileAlt className="text-green-500" title="Anamnese" />
                )}
                {patient.hasExams && (
                  <FaFileMedical className="text-blue-500" title="Exames" />
                )}
                {patient.hasRequests && (
                  <FaClipboardList
                    className="text-orange-500"
                    title="Solicitações"
                  />
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePatientClick(patient);
                  }}
                  className="bg-[#2D39A6] hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Detalhes
                </button>
                <Link
                  href={`/messages?patient=${patient.patientId}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaComments className="mr-1" /> Mensagem
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 flex items-center ${
                pagination.page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#2D39A6] hover:bg-blue-500"
              }`}
            >
              <FaChevronLeft className="mr-1" /> Anterior
            </button>

            <div className="px-4 py-2 border-l border-r text-gray-700">
              Página {pagination.page} de {pagination.totalPages}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 flex items-center ${
                pagination.page === pagination.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#2D39A6] hover:bg-blue-500"
              }`}
            >
              Próxima <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {patientHistories.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Nenhum paciente encontrado</p>
          {searchTerm && (
            <p className="text-gray-400 mt-2">
              Tente ajustar sua busca para encontrar o que está procurando
            </p>
          )}
        </div>
      )}

      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={handleCloseDetail}
          userRole={userRole}
        />
      )}
    </div>
  );
}
