"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClinicsNearby } from "../services/ClinicService";
import LoadingOverlay from "../components/LoadingOverlay";
import { FaClinicMedical } from "react-icons/fa";

export default function CloseClinicsSearchPage() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchClinics = async (latitude: number, longitude: number) => {
      try {
        const kilometers = 10; // Raio de 10km
        const data = await getClinicsNearby(latitude, longitude, kilometers);
        setClinics(data.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar clínicas próximas.");
      } finally {
        setLoading(false);
      }
    };

    // Geolocalização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchClinics(latitude, longitude);
        },
        (geoError) => {
          console.error("Erro ao obter geolocalização:", geoError.message);
          setError("Não foi possível obter sua localização.");
          setLoading(false);
        },
      );
    } else {
      setError("Geolocalização não suportada pelo navegador.");
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingOverlay />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const handleClinicClick = (clinicId: string) => {
    router.push(`/clinic/${clinicId}`);
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg w-full md:w-2/3 lg:w-1/2">
        <h2 className="text-2xl font-bold text-left mb-6 text-gray-800">
          Clínicas Próximas
        </h2>

        {clinics.length === 0 ? (
          <p className="text-gray-600">Nenhuma clínica encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {clinics.map((clinic) => (
              <li
                key={clinic.id}
                onClick={() => handleClinicClick(clinic.id)}
                className="border border-gray-300 p-4 flex flex-col rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center mb-2">
                  <FaClinicMedical className="text-2xl text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">{clinic.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  {clinic.about || "Sem descrição"}
                </p>
                <p className="text-gray-500 text-sm">
                  {clinic.locations?.[0]?.address || "Endereço não informado"}
                  {" - "}
                  {clinic.distance} metros
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
