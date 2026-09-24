"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clinic } from "../entities/Clinic";

interface ClinicProfileHeaderProps {
  clinic: Clinic | null;
}

const ClinicProfilePublicHeader: React.FC<ClinicProfileHeaderProps> = ({
  clinic,
}) => {
  const router = useRouter();

  const handleScheduleClick = () => {
    if (clinic?.id) {
      router.push(`/schedule_appointment_clinic?id=${clinic.id}`);
    }
  };

  const handleMessageClick = () => {
    router.push("/messages");
  };

  return (
    <div
      className="relative overflow-visible w-full"
      style={{
        height: "173px",
        borderRadius: "8px",
        opacity: 1,
        backgroundImage: "url('/images/banner_pattern.png')",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
      }}
    >
      <div className="absolute inset-x-0 bottom-0 top-[157px] flex items-start px-4 md:px-16 mx-auto max-w-7xl">
        <div className="w-[104px] h-[104px] rounded-lg bg-[#D9D9D9] overflow-hidden shadow-md flex-shrink-0">
          {clinic?.profileImage ? (
            <Image
              src={clinic.profileImage}
              alt={clinic.name || "Foto da Clínica"}
              layout="fill"
              objectFit="cover"
              className="object-cover rounded-lg"
            />
          ) : (
            <Image
              src="/images/logo_padrao_clinica.png"
              alt={clinic?.name || "Foto da Clínica"}
              width={104}
              height={104}
              className="object-cover rounded-lg"
            />
          )}
        </div>
        <h1
          className="text-black font-semibold text-base ml-4 mt-8 md:mt-8 whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          {clinic?.name}
        </h1>
      </div>
    </div>
  );
};

export default ClinicProfilePublicHeader;
