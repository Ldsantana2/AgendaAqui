import React from "react";

interface ProfileCompletionIndicatorProps {
  patient: any;
}

interface SectionStatus {
  name: string;
  isComplete: boolean;
  percentage: number;
}

const ProfileCompletionIndicator: React.FC<ProfileCompletionIndicatorProps> = ({
  patient,
}) => {
  const calculateSectionCompletion = () => {
    if (!patient) return [];

    const isDoctor = Array.isArray(patient.specialties);

    let sections = [];

    if (isDoctor) {
      sections = [
        {
          name: "Informações Pessoais",
          fields: [
            { name: "name", value: patient.name },
            { name: "surname", value: patient.surname },
            { name: "gender", value: patient.gender },
            { name: "aboutMe", value: patient.aboutMe },
          ],
        },
        {
          name: "Detalhes Legais",
          fields: [{ name: "crm", value: patient.crm }],
        },
        {
          name: "Especialidades",
          fields: [
            {
              name: "hasSpecialties",
              value:
                patient.specialties && patient.specialties.length > 0
                  ? "true"
                  : "",
            },
          ],
        },
        {
          name: "Operadoras de Saúde",
          fields: [
            {
              name: "hasHealthOperators",
              value:
                patient.healthOperators && patient.healthOperators.length > 0
                  ? "true"
                  : "",
            },
          ],
        },
      ];
    } else {
      sections = [
        {
          name: "Informações Pessoais",
          fields: [
            { name: "name", value: patient.name },
            { name: "surname", value: patient.surname },
            { name: "phone", value: patient.phone },
            { name: "dateOfBirth", value: patient.dateOfBirth },
          ],
        },
        {
          name: "Endereço",
          fields: [
            { name: "address", value: patient.addressInfo?.address },
            { name: "zipCode", value: patient.addressInfo?.zipCode },
            { name: "city", value: patient.addressInfo?.city },
          ],
        },
        {
          name: "Histórico Médico",
          fields: [
            {
              name: "pastDiseases",
              value: patient.medicalHistory?.pastDiseases,
            },
            {
              name: "chronicDiseases",
              value: patient.medicalHistory?.chronicDiseases,
            },
            {
              name: "familyDiseases",
              value: patient.medicalHistory?.familyDiseases,
            },
            { name: "allergies", value: patient.medicalHistory?.allergies },
          ],
        },
        {
          name: "Medicamentos",
          fields: [
            { name: "currentMedications", value: patient.medications?.current },
            { name: "pastMedications", value: patient.medications?.past },
          ],
        },
        {
          name: "Plano de Saúde",
          fields: [
            { name: "healthPlanNumber", value: patient.healthPlan?.number },
            {
              name: "healthPlanValidUntil",
              value: patient.healthPlan?.validUntil,
            },
            {
              name: "healthOperatorName",
              value: patient.healthPlan?.healthOperator?.name,
            },
          ],
        },
      ];
    }

    return sections.map((section) => {
      const filledFields = section.fields.filter(
        (field) => field.value && field.value.trim() !== "",
      ).length;
      const totalFields = section.fields.length;
      const percentage =
        totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

      return {
        name: section.name,
        isComplete: percentage === 100,
        percentage,
      };
    });
  };

  const calculateOverallPercentage = (sections: SectionStatus[]) => {
    if (sections.length === 0) return 0;

    const totalPercentage = sections.reduce(
      (sum, section) => sum + section.percentage,
      0,
    );
    return Math.round(totalPercentage / sections.length);
  };

  const sectionStatuses = calculateSectionCompletion();
  const overallPercentage = calculateOverallPercentage(sectionStatuses);
  const isComplete = sectionStatuses.every((section) => section.isComplete);

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-600">Completude do perfil</p>
        <p className="text-sm font-medium text-gray-900">
          {overallPercentage}%
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full ${isComplete ? "bg-green-600" : "bg-yellow-500"}`}
          style={{ width: `${overallPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfileCompletionIndicator;
