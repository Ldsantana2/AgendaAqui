"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Clinic } from "../../entities/Clinic";
import { ClinicService } from "../../entities/ClinicService";
import { ClinicLocation } from "../../entities/ClinicLocation";
import { ClinicReview } from "../../entities/ClinicReview";
import { ServiceCategory } from "../../entities/serviceCategory";
import { ClinicDoctor } from "../../entities/ClinicDoctor";
import Button from "../../components/Button";
import MessageSquareIcon from "../../components/icons/MessageSquareIcon";
import CalendarIcon from "../../components/icons/CalendarIcon";
import { getServiceCategories } from "../../services/serviceCategoryService";
import { getClinic } from "../../services/ClinicService";
import { getReviewsByClinicId } from "../../services/reviewService";
import ProfileSidebar, { SidebarItem } from "../../components/ProfileSidebar";
import ClinicViewService from "../../components/ClinicViewService";
import ClinicViewOpinions from "../../components/ClinicViewOpinions";
import ClinicProfilePublicHearder from "../../components/ClinicProfilePublicHeader";
import ProfileViewCard from "../../components/ProfileViewCard";
import ClinicViewDoctors from "../../components/ClinicViewDoctors";
import LoadingOverlay from "../../components/LoadingOverlay";
import ClinicViewSpeciality from "../../components/ClinicViewSpeciality";
import { TreatedArea } from "../../entities/TreatedArea";
import { Button as AntButton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getClinicTreatedAreas } from "../../services/TreatedAreasService";

type PublicClinicSectionKey =
  | "about"
  | "services"
  | "specialties"
  | "doctors"
  | "treated-areas";

export default function ClinicPage() {
  const router = useRouter();
  const { id } = router.query;

  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [currentServices, setCurrentServices] = useState<ClinicService[]>([]);
  const [currentLocations, setCurrentLocations] = useState<ClinicLocation[]>(
    [],
  );

  const [activeSection, setActiveSection] =
    useState<PublicClinicSectionKey>("about");

  const fetchClinicData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Busca clínica e reviews em paralelo
      const [clinicPayload, reviewsPayload, treatedAreasPayload] =
        await Promise.all([
          getClinic(id as string),
          getReviewsByClinicId(id as string),
          getClinicTreatedAreas(id as string),
        ]);
      console.log("ID da clínica:", id);
      console.log(
        "Payload de áreas tratadas recebido da API:",
        treatedAreasPayload,
      );
      setClinic({
        ...clinicPayload,
        reviews: reviewsPayload ?? [],
        treatedAreas: treatedAreasPayload ?? [],
      });

      setCurrentServices(clinicPayload.services || []);
      setCurrentLocations(clinicPayload.locations || []);

      const cats = await getServiceCategories();
      setServiceCategories(Array.isArray(cats) ? cats : []);

      setLoading(false);
    } catch (err: any) {
      console.error("Erro ao carregar dados da clínica:", err);
      setError(err.message || "Erro ao carregar dados da clínica.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClinicData();
  }, [fetchClinicData]);

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{
        background: "#F9FAFB",
      }}
    >
      {/* Botão fixo Voltar */}
      <AntButton
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          router.push(
            "/search?specialty=a260817a-505a-4279-a716-4f33a2d88e73&lat=-12.9564672&lon=-38.4106496&healthPlan=af2bc0bc-527f-49b5-8d35-9ec57dd48e1a",
          )
        }
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

      {loading && <LoadingOverlay />}
      {clinic && (
        <>
          <ClinicProfilePublicHearder clinic={clinic} />
          <div className="flex flex-col sm:flex-row gap-2 px-4 mt-24 sm:mt-6 justify-center sm:justify-end items-center">
            <Button
              label="Enviar mensagem"
              onClick={() =>
                alert(
                  "Funcionalidade de enviar mensagem não implementada ainda.",
                )
              }
              variant="outline"
              size="medium"
              iconStart={<MessageSquareIcon />}
            />
            <Button
              label="Agendar Consulta"
              onClick={() => {
                if (clinic?.id)
                  router.push(`/schedule_appointment_clinic?id=${clinic.id}`);
              }}
              variant="primary"
              size="medium"
              iconStart={<CalendarIcon />}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-8 md:px-16 py-8 flex flex-col md:flex-row gap-6 mt-[24px]">
            <div className="md:w-1/4 flex-shrink-0">
              <ProfileSidebar
                activeTab={activeSection}
                onTabChange={(tabId) =>
                  setActiveSection(tabId as PublicClinicSectionKey)
                }
                menuItems={[
                  { key: "about", label: "Sobre a clínica" },
                  { key: "services", label: "Serviços oferecidos" },
                  { key: "specialties", label: "Especialidades" },
                  { key: "doctors", label: "Médicos" },
                ]}
              />
            </div>

            <div className="flex-1 space-y-6 overflow-x-hidden md:pl-12">
              {activeSection === "about" && (
                <>
                  <div
                    className="flex flex-col"
                    style={{
                      gap: "24px",
                    }}
                  >
                    <ProfileViewCard
                      title="Sobre a clínica"
                      titleStyle={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#000000",
                      }}
                      style={{
                        width: "w-full max-w-[660px]",
                        padding: "16px",
                        gap: "16px",
                      }}
                      className="p-8 flex-col gap-8 justify-between"
                    >
                      <p
                        className="text-gray-700 text-base leading-relaxed"
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#000000",
                        }}
                      >
                        {clinic.about ||
                          "Nenhuma descrição disponível para esta clínica."}
                      </p>
                      <div
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 400,
                          fontSize: "16px",
                          letterSpacing: "0%",
                          color: "#000000",
                          width: "596px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      ></div>
                    </ProfileViewCard>

                    <ProfileViewCard
                      title="Endereços da clínica"
                      titleStyle={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "20px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#000000",
                      }}
                      style={{
                        width: "w-full max-w-[660px]",
                        height: "271px",
                        padding: "16px",
                        gap: "16px",
                      }}
                      className="p-8 flex flex-col gap-6"
                      titleBottomMarginClass="mb-2"
                    >
                      {clinic.locations && clinic.locations.length > 0 ? (
                        clinic.locations.map((location, index) => (
                          <div key={index} className="flex flex-col gap-8">
                            <p
                              style={{
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "100%",
                                letterSpacing: "0%",
                                color: "#000000",
                              }}
                            >
                              Endereço
                              <br />
                              <span className="font-semibold">
                                {location.address || "Não informado"}
                              </span>
                            </p>
                            <div
                              className="grid gap-x-16 gap-y-4"
                              style={{
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "100%",
                                letterSpacing: "0%",
                                color: "#000000",
                                gridTemplateColumns:
                                  "minmax(0, 1fr) minmax(0, 1fr)",
                              }}
                            >
                              <p>
                                Número
                                <br />
                                <span className="font-semibold whitespace-nowrap">
                                  {location.number || "Não informado"}
                                </span>
                              </p>
                              <p>
                                Bairro
                                <br />
                                <span className="font-semibold whitespace-nowrap">
                                  {location.bairro || "Não informado"}
                                </span>
                              </p>
                              <p>
                                Cidade
                                <br />
                                <span className="font-semibold whitespace-nowrap">
                                  {location.city || "Não informado"}
                                </span>
                              </p>
                              <p>
                                Estado
                                <br />
                                <span className="font-semibold whitespace-nowrap">
                                  {location.state || "Não informado"}
                                </span>
                              </p>
                            </div>
                            {index < clinic.locations.length - 1 && (
                              <hr className="my-4 border-gray-200" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700">
                          Nenhum endereço disponível para esta clínica.
                        </p>
                      )}
                    </ProfileViewCard>

                    <ProfileViewCard title="">
                      {clinic.reviews && clinic.reviews.length > 0 ? (
                        <ClinicViewOpinions
                          totalOpinions={clinic.reviews.length}
                          overallRating={
                            clinic.reviews.reduce(
                              (acc, cur) => acc + cur.rating,
                              0,
                            ) / clinic.reviews.length
                          }
                          opinions={clinic.reviews}
                        />
                      ) : (
                        <p className="text-gray-600">
                          Nenhuma opinião disponível.
                        </p>
                      )}
                    </ProfileViewCard>
                  </div>
                </>
              )}
              {activeSection === "services" && (
                <ProfileViewCard title="">
                  {currentServices && currentServices.length > 0 ? (
                    <ClinicViewService
                      services={currentServices}
                      serviceCategories={serviceCategories}
                    />
                  ) : (
                    <p className="text-gray-600">Nenhum serviço oferecido.</p>
                  )}
                </ProfileViewCard>
              )}
              {activeSection === "specialties" && (
                <>
                  <ProfileViewCard
                    title="Especialidades"
                    titleStyle={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "20px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#000000",
                    }}
                  >
                    {clinic.doctors && clinic.doctors.length > 0 ? (
                      <ClinicViewSpeciality doctors={clinic.doctors} />
                    ) : (
                      <p className="p-6 text-gray-600">
                        Nenhuma especialidade informada.
                      </p>
                    )}
                  </ProfileViewCard>
                  <ProfileViewCard
                    title="Áreas Tratadas"
                    titleStyle={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "20px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#000000",
                    }}
                  >
                    {clinic.treatedAreas && clinic.treatedAreas.length > 0 ? (
                      <div className="p-6">
                        <ul className="list-disc list-inside space-y-2">
                          {clinic.treatedAreas.map((area, index) => (
                            <li key={index} className="text-gray-700">
                              {area.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="p-6 text-gray-600">
                        Nenhuma área tratada informada.
                      </p>
                    )}
                  </ProfileViewCard>
                </>
              )}

              {activeSection === "doctors" && (
                <ProfileViewCard
                  title="Médicos"
                  titleStyle={{
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "20px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#000000",
                  }}
                >
                  {clinic.doctors && clinic.doctors.length > 0 ? (
                    <ClinicViewDoctors doctors={clinic.doctors} />
                  ) : (
                    <p className="p-6 text-gray-600">
                      Nenhum médico vinculado a esta clínica.
                    </p>
                  )}
                </ProfileViewCard>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
