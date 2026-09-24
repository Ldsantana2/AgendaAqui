import React from "react";

interface SectionCompletionIndicatorProps {
  title: string;
  fields: { name: string; value: any }[];
  showProgressBar?: boolean;
}

const SectionCompletionIndicator: React.FC<SectionCompletionIndicatorProps> = ({
  title,
  fields,
  showProgressBar = true,
}) => {
  // Calculate section completion
  const calculateCompletion = () => {
    const filledFields = fields.filter(
      (field) => field.value && String(field.value).trim() !== "",
    ).length;
    const totalFields = fields.length;
    const percentage =
      totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    return {
      isComplete: percentage === 100,
      percentage,
    };
  };

  const { isComplete, percentage } = calculateCompletion();

  return (
    <div className="flex items-center space-x-2 mb-2">
      <span
        className={`px-2 py-0.5 text-xs rounded-full ${
          isComplete
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {isComplete ? "Completo" : "Incompleto"}
      </span>
    </div>
  );
};

export default SectionCompletionIndicator;
