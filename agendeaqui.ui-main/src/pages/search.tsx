"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFilters from "../components/SearchFilters";
import ErrorPage from "../components/error/ErrorPage";
import ClinicCard from "../components/ClinicCard";
import ClinicCardSkeleton from "../components/ClinicCardSkeleton";
import { searchClinics } from "../services/ClinicService";
import { Button as AntButton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Clinic } from "../entities/Clinic";
import { getUserLocation } from "../utils/locationUtils";

export type SearchFilters = {
  examId?: string;
  doctorId?: string;
  clinicId?: string;
  specialtyId?: string;
  healthOperatorId?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
};

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState<any[]>([]);
  const [userLatitude, setUserLatitude] = useState<string | null>(null);
  const [userLongitude, setUserLongitude] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const getClinicPhoto = (clinic: any) => clinic?.image || "/images/clinic.jpg";

  const getDoctorPhoto = (doctorId: string) => {
    const mockPhotos = [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/3.jpg",
      "https://randomuser.me/api/portraits/men/3.jpg",
      "https://randomuser.me/api/portraits/men/4.jpg",
      "https://randomuser.me/api/portraits/men/5.jpg",
      "https://randomuser.me/api/portraits/women/6.jpg",
      "https://randomuser.me/api/portraits/men/7.jpg",
      "https://randomuser.me/api/portraits/women/8.jpg",
    ];
    const idSum = doctorId
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return mockPhotos[idSum % mockPhotos.length];
  };




  useEffect(() => {
    const filters: SearchFilters = {
      examId: searchParams.get("exam") || undefined,
      doctorId: searchParams.get("doctor") || undefined,
      clinicId: searchParams.get("clinic") || undefined,
      specialtyId: searchParams.get("specialty") || undefined,
      latitude: searchParams.get("lat") || undefined,
      longitude: searchParams.get("lon") || undefined,
      healthOperatorId: searchParams.get("healthPlan") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    console.log("Filtros da URL:", filters);

    if (!filters.clinicId && !filters.specialtyId && !filters.doctorId && !filters.examId) {
      setError("Filtro não especificado");
      setLoading(false);
      return;
    }

    const fetchClinics = async (
      currentFilters: SearchFilters,
    ) => {
      setLoading(true);
      setError("");
      try {
        const clinicsData = await searchClinics(currentFilters);
        setClinics(clinicsData);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar resultados");
      } finally {
        setLoading(false);
      }
    };

    if (filters.latitude && filters.longitude) {
      setUserLatitude(filters.latitude);
      setUserLongitude(filters.longitude);
      fetchClinics(filters);
    } else {
      import("../utils/locationUtils").then(({ getUserLocation }) =>
        getUserLocation()
          .then(({ latitude, longitude }) => {
            const latStr = latitude.toString();
            const lonStr = longitude.toString();
            setUserLatitude(latStr);
            setUserLongitude(lonStr);
            const updatedFilters = { ...filters, latitude: latStr, longitude: lonStr };
            fetchClinics(updatedFilters);
          })
          .catch((error) => {
            console.error("Failed to get user location:", error);
            fetchClinics(filters);
          }),
      );
    }
  }, [searchParams]);


  if (error) {
    return (
      <ErrorPage
        status="error"
        title="Erro na busca"
        subTitle={error}
        buttonText="Voltar"
        redirectTo="/"
      />
    );
  }

  return (
    <div className="bg-white p-8 max-w-7xl mx-auto w-full relative">
      <AntButton
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          color: "#0d9488",
          borderColor: "#0d9488",
          zIndex: 1000,
        }}
      />

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Resultados da busca
      </h2>

      <SearchFilters
        onSearch={async (filters) => {
          const examId = searchParams.get("exam");
          if (!examId) return setError("Exame não especificado");
          const doctorId = searchParams.get("doctor");
          if (!doctorId) return setError("Profissional não especificado");
          const specialtyId = searchParams.get("specialty");
          if (!specialtyId) return setError("Especialidade não especificada");
          const clinicId = searchParams.get("clinic")
          if (!clinicId) return setError("Clinica não especificada");

          setLoading(true);
          setError("");
          try {
            const clinicsData = await searchClinics(filters);
            setClinics(clinicsData);
          } catch (err) {
            console.error(err);
            setError("Erro ao filtrar resultados");
          } finally {
            setLoading(false);
          }
        }}
        onClinicsFound={() => { }}
      />

      {loading ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, index) => (
            <ClinicCardSkeleton key={index} />
          ))}
        </ul>
      ) : clinics.length === 0 ? (
        <p className="text-gray-600 mt-6 text-center">
          Nenhum resultado encontrado.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {clinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinicBasic={clinic}
              getClinicPhoto={getClinicPhoto}
              getDoctorPhoto={getDoctorPhoto}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
