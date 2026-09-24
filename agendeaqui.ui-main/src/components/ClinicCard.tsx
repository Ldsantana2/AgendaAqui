"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClinicRating from "../components/ClinicRating";
import ClinicCardSkeleton from "./ClinicCardSkeleton";
import { getClinicSpecialtiesByClinicId } from "../services/specialtyService";
import { getClinicHealthOperators } from "../services/clinicHealthOperatorService";
import { getClinicDoctors, getClinicReviews } from "../services/ClinicService";

interface HealthOperator {
  id: string;
  operatorCompanyName: string;
  operatorRegistry?: string;
}

interface Specialty {
  id: string;
  name: string;
  specialty?: { name: string };
}

interface Doctor {
  id: string;
  name: string;
  profileImage?: string;
}

interface Review {
  rating: number;
}

interface ClinicBasic {
  id: string;
  name: string;
  locations?: { address?: string; number?: string }[];
}

interface ClinicCardProps {
  clinicBasic: ClinicBasic;
  getDoctorPhoto: (doctorId: string) => string;
  getClinicPhoto: (clinic: ClinicBasic) => string;
}

export default function ClinicCard({
  clinicBasic,
  getDoctorPhoto,
  getClinicPhoto,
}: ClinicCardProps) {
  const router = useRouter();

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [operators, setOperators] = useState<HealthOperator[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const [specs, ops, docs, reviews] = await Promise.all([
          getClinicSpecialtiesByClinicId(clinicBasic.id),
          getClinicHealthOperators(clinicBasic.id),
          getClinicDoctors(clinicBasic.id),
          getClinicReviews(clinicBasic.id),
        ]);
        setSpecialties(specs || []);
        setOperators(ops?.map((o: any) => o.healthOperator) || []);
        setDoctors(docs || []);

        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce(
            (acc: number, cur: Review) => acc + cur.rating,
            0,
          );
          setRating(sum / reviews.length);
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error("Erro ao carregar dados complementares:", error);
        setRating(0);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [clinicBasic.id]);

  if (loading) {
    return <ClinicCardSkeleton />;
  }

  return (
    <li
      className="shadow-sm hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden bg-white w-full sm:w-[404px] h-[512px] rounded-2xl border border-[#DFDFDF]"
      style={{
        borderRadius: "16px",
        border: "1px solid #DFDFDF",
      }}
      onClick={() => router.push(`/clinic/${clinicBasic.id}`)}
    >
      {/* Imagem topo */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "164px",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          background:
            "linear-gradient(0deg, #EFF1F1, #EFF1F1), linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
        }}
      >
        <img
          src={getClinicPhoto(clinicBasic)}
          alt={clinicBasic.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col justify-between px-4 py-6 font-['Inter']">
        <div className="flex flex-col space-y-4">
          {/* Nome e nota */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-black leading-none">
              {clinicBasic.name}
            </h2>
            <ClinicRating rating={rating} />
          </div>

          {/* Endereço */}
          <div className="flex items-center gap-1.5 text-base font-medium leading-none">
            <span className="text-black inline-block truncate max-w-[60%] sm:max-w-none">
              {clinicBasic.locations?.[0]?.address || "Endereço não informado"}
              {clinicBasic.locations?.[0]?.number
                ? ", " + clinicBasic.locations[0].number
                : ""}
            </span>
          </div>

          {/* Convênios */}
          <div>
            <p className="text-xs font-medium text-black leading-none">
              Convênios aceitos:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {operators.length > 0 ? (
                operators.map((op) => (
                  <span
                    key={op.id}
                    className="py-1 px-2 bg-[#F5F5F5] text-black text-xs font-normal rounded-lg leading-none"
                  >
                    {op.operatorCompanyName}
                  </span>
                ))
              ) : (
                <span className="py-1 px-2 bg-[#F5F5F5] text-black text-xs font-normal rounded-lg leading-none">
                  Particular
                </span>
              )}
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <p className="text-xs font-medium text-black leading-none">
              Especialidades:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.length > 0 ? (
                specialties.map((s) => (
                  <span
                    key={s.id}
                    className="py-1 px-2 bg-[#F5F5F5] text-black text-xs font-normal rounded-lg leading-none"
                  >
                    {s.name || s.specialty?.name}
                  </span>
                ))
              ) : (
                <span className="py-1 px-2 bg-[#F5F5F5] text-black text-xs font-normal rounded-lg leading-none">
                  Não informado
                </span>
              )}
            </div>
          </div>

          {/* Médicos */}
          <div>
            <p className="text-xs font-medium text-black leading-none">
              Equipe médica:
            </p>
            <div className="flex -space-x-2 overflow-hidden mt-2">
              {doctors.length > 0
                ? doctors
                    .slice(0, 5)
                    .map((doctor, i) => (
                      <img
                        key={doctor.id}
                        src={
                          doctor.profileImage ||
                          getDoctorPhoto(
                            doctor.id || `mock-${clinicBasic.id}-${i}`,
                          )
                        }
                        alt={doctor.name}
                        className="inline-block h-6 w-6 rounded-full border border-white object-cover"
                        title={`Dr. ${doctor.name}`}
                      />
                    ))
                : Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`mock-doc-${i}`}
                      className="inline-block h-6 w-6 rounded-full border border-white bg-gray-300"
                    />
                  ))}
              {doctors.length > 5 && (
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#F5F5F5] text-xs font-medium text-black">
                  +{doctors.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão Agendar Consulta */}
        <div className="mt-2">
          <button
            className="w-full h-10 bg-[#2D39A6] text-[#F5F5F5] rounded-lg
                flex items-center justify-center py-2 px-4
                hover:bg-[#1f2975] transition"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/schedule_appointment_clinic?id=${clinicBasic.id}`);
            }}
          >
            <span className="text-base font-normal leading-none">
              Agendar consulta
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}
