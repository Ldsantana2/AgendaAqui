"use client";
import React, { useMemo } from "react";
import { Specialty } from "../entities/specialty";
import { ClinicDoctor } from "../entities/ClinicDoctor";

interface ClinicSpecialtyProps {
  doctors: ClinicDoctor[];
}

const ClinicSpecialty: React.FC<ClinicSpecialtyProps> = ({ doctors }) => {
  const allSpecialties = useMemo(() => {
    const map = new Map<string, Specialty>();
    doctors.forEach((doctor) => {
      if (doctor.specialties && Array.isArray(doctor.specialties)) {
        doctor.specialties.forEach((spec) => {
          map.set(spec.id, spec);
        });
      }
    });
    return Array.from(map.values());
  }, [doctors]);

  return (
    <>
      {allSpecialties.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {allSpecialties.map((spec) => (
            <span 
              key={spec.id}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md"
            >
              {spec.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          Nenhuma especialidade encontrada para esta clínica.
        </p>
      )}
    </>
  );
};

export default ClinicSpecialty;
