// components/ClinicInfoCard.tsx
import Image from "next/image";
import { EnvironmentOutlined } from "@ant-design/icons";
import type { Clinic } from "../entities/Clinic";

interface Props {
  clinic: Clinic;
  specialties?: string[];
}

export default function ClinicInfoCard({ clinic, specialties = [] }: Props) {
  const imageSrc = clinic.profileImage || "/images/logo_padrao_clinica.png";

  const rawAddress = clinic.locations?.[0]?.address || "";
  const formattedAddress = rawAddress
    ? rawAddress
        .split(" ")
        .map((word) =>
          word.length > 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : "",
        )
        .join(" ")
    : "";

  return (
    <div className="bg-white rounded shadow p-4 flex items-start gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
        <Image
          src={imageSrc}
          alt={clinic.name || "Clínica"}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800 mb-1">{clinic.name}</h1>

        {/* -- Especialidades: mostra lista ou mensagem padrão -- */}
        {specialties.length > 0 ? (
          <p className="text-sm mb-2">{specialties.join(", ")}</p>
        ) : (
          <p className="text-sm mb-2">
            <strong>Especialidades não informadas</strong>
          </p>
        )}

        {formattedAddress && (
          <p className="flex items-center text-sm">
            <EnvironmentOutlined className="mr-1" />
            {formattedAddress}
          </p>
        )}
      </div>
    </div>
  );
}
