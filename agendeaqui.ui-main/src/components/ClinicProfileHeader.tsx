"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clinic } from "./../entities/Clinic";
import { FaPencilAlt } from "react-icons/fa";

interface ProfileHeaderProps {
  clinic: Clinic;
  onEditImageClick?: () => void;
  onViewPublicProfile?: () => void;
  onViewLinkedDoctors?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  clinic,
  onEditImageClick,
  onViewPublicProfile,
  onViewLinkedDoctors,
}) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[170px] bg-[#E0E4E8] from-[#2D39A6] to-[#283277] overflow-visible">
      <div
        className="absolute rounded-full inset-x-0 bottom-[-60px] flex flex-col sm:flex-row items-center sm:items-end sm:justify-start gap-4 px-4
                   left-4 sm:left-[115px] 
                  "
        style={{
          width: "120px",
          height: "120px",
          bottom: "-60px",
          backgroundColor: "#D9D9D9",
        }}
      >
        {clinic.profileImage ? (
          <Image
            src={clinic.profileImage}
            alt={clinic.name || "Foto da Clínica"}
            layout="fill"
            objectFit="cover"
            className="object-cover rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 text-5xl font-bold">
            {clinic.name ? clinic.name[0].toUpperCase() : ""}
          </div>
        )}

        {onEditImageClick && (
          <button
            onClick={onEditImageClick}
            className="absolute rounded-full p-2 flex items-center justify-center transition-colors duration-200 hover:bg-[#cdd2f3]"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#E5E7FB",
              bottom: "0px",
              right: "0px",
              transform: "translate(2%, 2%)",
              zIndex: 10,
            }}
            aria-label="Editar foto de perfil"
          >
            <FaPencilAlt
              className="text-[#2D39A6]"
              style={{ width: "18px", height: "18px" }}
            />
          </button>
        )}
      </div>

      {/* Título (Nome da Clínica) */}
      <h1
        className="absolute font-semibold text-base text-black
                   left-[152px] sm:left-[240px] 
                  "
        style={{
          bottom: "-30px",
          fontFamily: "Inter",
          fontWeight: 600,
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {clinic.name}
      </h1>
    </div>
  );
};

export default ProfileHeader;
