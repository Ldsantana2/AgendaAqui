"use client";
import React, { useEffect, useState, useCallback } from "react";
import type { Consultation } from "../components/PatientConsultations";
import { useRouter } from "next/navigation";
import PatientConsultations from "../components/PatientConsultations";
import { getProfile } from "../services/authService";
import { getMyAppointments } from "../services/appointmentService";
import { getReviewsByAppointmentId } from "../services/reviewService";
import { Review } from "../entities/Review";
import LoadingOverlay from "../components/LoadingOverlay"; // 👈 NOVO: Importação do componente de loading

export const findMockPhoto = (
  doctorName: string | null | undefined,
  doctorGender: string | null | undefined = "",
) => {
  const portraitCategory =
    (doctorGender || "").toLowerCase().trim() === "feminino" ||
    (doctorGender || "").toLowerCase().trim() === "female"
      ? "women"
      : "men";
  return `https://randomuser.me/api/portraits/${portraitCategory}/${Math.floor(
    Math.random() * 99,
  )}.jpg`;
};

export const getDoctorPrefix = (gender: string | null | undefined = "") => {
  const g = gender.toLowerCase().trim();
  if (g === "feminino" || g === "female" || g === "f") return "Dra.";
  if (g === "masculino" || g === "male" || g === "m") return "Dr.";
  return "Dr.";
};

export default function ConsultationsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const fetchConsultations = useCallback(async () => {
    console.time("fetchConsultations");

    setIsLoading(true);
    try {
      const appointmentsData = await getMyAppointments();

      const mergedConsultations: Consultation[] = [];

      for (const statusKey of Object.keys(appointmentsData)) {
        const statusAppointments =
          appointmentsData[statusKey as keyof typeof appointmentsData];

        if (Array.isArray(statusAppointments)) {
          statusAppointments.forEach((c: any) => {
            const doctorFullName = `${getDoctorPrefix(
              c.doctor?.gender || "",
            )} ${c.doctor?.name || ""} ${c.doctor?.surname || ""}`.trim();
            const clinicName =
              c.clinicName || c.Clinic?.name || "Clínica não informada";
            const clinicIdFromBackend = c.clinicId || c.Clinic?.id || "";
            const clinicAddress = c.clinicLocation
              ? `${c.clinicLocation.address}, ${c.clinicLocation.number}${
                  c.clinicLocation.complement
                    ? `, ${c.clinicLocation.complement}`
                    : ""
                }, ${c.clinicLocation.city} - ${c.clinicLocation.state}, ${
                  c.clinicLocation.cep
                }`
              : "Endereço não informado";

            let consultationStatus:
              | "PENDING"
              | "CONFIRMED"
              | "COMPLETED"
              | "DECLINED"
              | "CANCELED";
            if (statusKey === "AGENDADA") {
              consultationStatus =
                c.confirmationStatus === "CONFIRMED" ? "CONFIRMED" : "PENDING";
            } else if (statusKey === "REALIZADA") {
              consultationStatus = "COMPLETED";
            } else if (statusKey === "CANCELADA") {
              consultationStatus = "CANCELED";
            } else {
              consultationStatus = "PENDING";
            }

            mergedConsultations.push({
              id: c.id,
              patientId: c.patientId,
              doctor: c.doctor,
              doctorName: doctorFullName,
              doctorPhoto:
                c.doctor?.photo ||
                findMockPhoto(doctorFullName, c.doctor?.gender),
              doctorSpecialty:
                c.doctor?.specialtyLinks?.length > 0
                  ? c.doctor.specialtyLinks
                      .map((link: any) => link.specialty.name)
                      .join(", ")
                  : "Especialidade não informada",
              date: new Date(c.date).toLocaleDateString("pt-BR"),
              startTime: c.startTime,
              endTime: c.endTime,
              clinicName: clinicName,
              clinicAddress: clinicAddress,
              clinicPhoto: c.Clinic?.photo || "/images/logo.png",
              clinicLocation: {
                id: c.clinicLocation?.id || "",
                address: c.clinicLocation?.address || "",
                city: c.clinicLocation?.city || "",
                state: c.clinicLocation?.state || "",
                cep: c.clinicLocation?.cep || "",
                number: c.clinicLocation?.number || "",
                complement: c.clinicLocation?.complement,
                clinicId: clinicIdFromBackend,
                clinic: c.clinicLocation?.clinic,
              },
              status: consultationStatus,
              hasReview: c.hasReview,
              review: {
                id: c.review?.id,
                rating: c.review?.rating,
                comment: c.review?.comment,
              },
            });
          });
        }
      }
      setConsultations(mergedConsultations);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    } finally {
      setIsLoading(false);
      console.timeEnd("fetchConsultations");
    }
  }, []);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      try {
        const profile = await getProfile();
        if (profile?.user) {
          setUserRole(profile.user.role);
          if (profile.user.role !== "PATIENT") {
            router.push("/calendar");
          } else {
            fetchConsultations();
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkUserAndFetch();
  }, [router, fetchConsultations]);

  if (isLoading) {
    return (
      // 👈 NOVO: Aqui o componente de Loading é renderizado
      <LoadingOverlay />
    );
  }

  if (userRole === "PATIENT") {
    return (
      <PatientConsultations
        consultations={consultations}
        onAppointmentActionComplete={fetchConsultations}
      />
    );
  }

  return null;
}
