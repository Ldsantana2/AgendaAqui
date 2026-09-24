"use client";

import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchSection from "../components/home/AgendeSuaConsulta";
import ServiceTypeSelector from "../components/home/ServiceTypeSelector";
import ServicesSection from "../components/home/NossosServicos";
import BlogSection from "../components/home/BlogSaude";
import ClinicasMaisAvaliadas from "../components/home/ClinicasMaisAvaliadas";
import { getSpecialties } from "../services/specialtyService";
import { getHealthOperators } from "../services/healthOperatorService";
import { getExamTypes } from "../services/examService";
import { getProfile } from "../services/authService";
import { ClinicLocation } from "../entities/ClinicLocation";
import { getClinicReviews, getClinicsByCity } from "../services/ClinicService";
import { RegisterClinicCallToAction } from "../components/home/RegisterClinicCallToAction";
import { Clinic } from "../entities/Clinic";
import { searchForIndexPage } from "../services/searchService";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoLocationLoading, setGeoLocationLoading] = useState(false);
  const [healthPlan, setHealthPlan] = useState<string>("Particular");
  const [healthPlanMode, setHealthPlanMode] = useState("particular");
  const [healthOperators, setHealthOperators] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState("consultas");
  const [bestClinics, setBestClinics] = useState<Clinic[]>([]);
  const [dateRange, setDateRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const [searchForIndex, setSearchForIndex] = useState([])
  const router = useRouter();

  const blogPosts = [
    {
      id: 1,
      title: "Como escolher o médico certo para sua necessidade",
      excerpt:
        "Descubra dicas importantes para encontrar o profissional de saúde ideal para seu caso específico.",
      date: "10 Jun 2023",
      image: "/images/blog_post1.png",
      category: "Saúde Geral",
    },
    {
      id: 2,
      title: "Benefícios de manter consultas regulares",
      excerpt:
        "Saiba por que é importante não faltar às consultas médicas agendadas e como isso impacta sua saúde.",
      date: "05 Jun 2023",
      image: "/images/blog_post2.png",
      category: "Prevenção",
    },
    {
      id: 3,
      title: "Entendendo seu plano de saúde",
      excerpt:
        "Um guia completo para compreender melhor a cobertura do seu plano de saúde e seus benefícios.",
      date: "28 Mai 2023",
      image: "/images/blog_post3.png",
      category: "Planos de Saúde",
    },
  ];

  const formatDisplayName = useCallback((location: any) => {
    const address = location.address;
    if (!address) return location.display_name;
    if (address.state) {
      const city =
        address.city || address.town || address.village || address.municipality;
      if (city) {
        return `${city} - ${address.state}`;
      } else {
        return address.state;
      }
    }
    return location.display_name;
  }, []);

  // Carregar dados do usuário, operadoras e especialidades/exames em paralelo
  useEffect(() => {
    async function fetchUserProfileAndData() {
      setLoading(true);
      try {
        // Requisições paralelas
        const profilePromise = getProfile();
        const operatorsPromise = getHealthOperators();
        const serviceDataPromise =
          serviceType === "exames" ? getExamTypes() : getSpecialties();

        const [profile, operators, serviceData] = await Promise.all([
          profilePromise,
          operatorsPromise,
          serviceDataPromise,
        ]);

        // Configurar plano de saúde a partir do perfil
        const patientHealthPlans = profile.patient?.healthPlans;
        if (
          patientHealthPlans &&
          Array.isArray(patientHealthPlans) &&
          patientHealthPlans.length > 0
        ) {
          const primaryPlan = patientHealthPlans.find(
            (plan: any) => plan.isPrimary === true,
          );
          if (primaryPlan && primaryPlan.healthOperator?.id) {
            setHealthPlan(primaryPlan.healthOperator.id);
            setHealthPlanMode("convenio");
          } else {
            setHealthPlan("Particular");
            setHealthPlanMode("particular");
          }
        } else {
          setHealthPlan("Particular");
          setHealthPlanMode("particular");
        }

        // Ajustar dados no estado
        setHealthOperators(Array.isArray(operators) ? operators : []);
        if (serviceType === "exames") {
          setExamTypes(Array.isArray(serviceData) ? serviceData : []);
          setSpecialties([]);
        } else {
          setSpecialties(Array.isArray(serviceData) ? serviceData : []);
          setExamTypes([]);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil ou operadoras:", err);
        setError("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfileAndData();
  }, [serviceType]);

  const getUserLocation = useCallback(() => {
    // Try to get location from localStorage first
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setSelectedLocation(parsedLocation);
        return;
      } catch (e) {
        console.error("Error parsing saved location:", e);
        localStorage.removeItem("userLocation");
      }
    }

    if (!navigator.geolocation) return;

    setGeoLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Perform reverse geocoding to get address details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const location = {
              display_name: data.display_name,
              lat: latitude.toString(),
              lon: longitude.toString(),
              address: data.address
            };
            setSelectedLocation(location);
            localStorage.setItem("userLocation", JSON.stringify(location));
          } else {
            // Fallback to coordinates if reverse geocoding fails
            const location = {
              display_name: `Lat: ${latitude}, Lon: ${longitude}`,
              lat: latitude.toString(),
              lon: longitude.toString(),
            };
            setSelectedLocation(location);
          }
        } catch (error) {
          console.error("Error in reverse geocoding:", error);
          // Fallback to coordinates
          const location = {
            display_name: `Lat: ${latitude}, Lon: ${longitude}`,
            lat: latitude.toString(),
            lon: longitude.toString(),
          };
          setSelectedLocation(location);
        }

        setGeoLocationLoading(false);
      },
      () => {
        setGeoLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const handleSearch = (e: React.FormEvent | any) => {
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const params = new URLSearchParams();

    const itemValue = e.selectedItem
    const specialtyValue = e.specialty || specialty;
    const healthPlanValue = e.healthPlan || healthPlan;
    const dateRangeValue = e.dateRange || dateRange;
    const advancedFiltersValue = e.advancedFilters || {};

    setSpecialty(specialtyValue);
    setHealthPlan(healthPlanValue);
    setDateRange(dateRangeValue);

    if (itemValue?.type === "Exame") {
      params.append("exam", itemValue.id);
    } else if (itemValue?.type === "Especialidade") {
      params.append("specialty", itemValue.id);
    } else if (itemValue?.type === "Profissional") {
      params.append("doctor", itemValue.id);
    } else if (itemValue?.type === "Clínica") {
      params.append("clinic", itemValue.id);
    }

    if (specialtyValue) {
      if (serviceType === "exames") {
        params.append("examType", specialtyValue);
      } else {
        params.append("specialty", specialtyValue);
      }
    }

    if (selectedLocation?.lat && selectedLocation?.lon) {
      params.append("lat", selectedLocation.lat);
      params.append("lon", selectedLocation.lon);
    }

    if (healthPlanMode === "convenio" && healthPlanValue) {
      params.append("healthPlan", healthPlanValue);
    }

    if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
      params.append("startDate", dateRangeValue[0].format("YYYY-MM-DD HH:mm"));
      params.append("endDate", dateRangeValue[1].format("YYYY-MM-DD HH:mm"));
    }

    if (advancedFiltersValue.neighborhood) {
      params.append("neighborhood", advancedFiltersValue.neighborhood);
    }

    const searchPath = serviceType === "exames" ? "/search_exams" : "/search";
    router.push(`${searchPath}?${params.toString()}`);
  };

  useEffect(() => {
    if (!selectedLocation) return;

    const bestClinicsInUserLocation = async () => {

      try {
        let city =
          selectedLocation?.address?.city ||
          selectedLocation?.address?.town ||
          selectedLocation?.address?.village ||
          selectedLocation?.address?.municipality;

        const response = await getClinicsByCity(city);
        setBestClinics(response);
      } catch (error) {
        console.error("Erro ao buscar clínicas:", error);
      } finally {
      }
    };

    bestClinicsInUserLocation();
  }, [selectedLocation]);


  useEffect(() => {
    const searchForIndex = async () => {
      try {
        const response = await searchForIndexPage()
        setSearchForIndex(response)
        return response
      } catch (error) {
        console.error("Erro ao buscar os itens", error)
      }
    }

    searchForIndex()
  }, [])


  if (loading) return <LoadingOverlay />;
  if (error) return <p>Erro: {error}</p>;

  return (
    <>
      <ServiceTypeSelector
        selectedType={serviceType}
        setSelectedType={setServiceType}
      />
      <SearchSection
        searchForIndex={searchForIndex}
        healthPlanMode={healthPlanMode}
        setHealthPlanMode={setHealthPlanMode}
        healthPlan={healthPlan}
        setHealthPlan={setHealthPlan}
        healthOperators={healthOperators}
        specialty={specialty}
        setSpecialty={setSpecialty}
        specialties={serviceType === "exames" ? examTypes : specialties}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        geoLocationLoading={geoLocationLoading}
        handleSearch={handleSearch}
        serviceType={serviceType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <ClinicasMaisAvaliadas selectedLocation={selectedLocation} bestClinics={bestClinics} />
      <ServicesSection />
      <RegisterClinicCallToAction />
      <BlogSection blogPosts={blogPosts} />
    </>
  );
}
