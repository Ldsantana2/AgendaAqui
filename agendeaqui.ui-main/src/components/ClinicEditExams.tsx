import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { removeClinicExam } from "../services/examService";

type Exam = {
  id: string;
  name: string;
};

type ClinicExamsProps = {
  clinicId: string;
  initialExams: Exam[];
  onChange: (updatedExams: Exam[]) => void;
  onEdit: () => void;
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
};

export default function ClinicExams({
  clinicId,
  initialExams,
  onChange,
  onEdit,
  isEditingExternally,
}: ClinicExamsProps) {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [examToRemove, setExamToRemove] = useState<Exam | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  useEffect(() => {
    setExams(initialExams);
  }, [initialExams]);

  const confirmRemoveExam = (exam: Exam) => {
    setExamToRemove(exam);
  };

  const cancelRemove = () => {
    setExamToRemove(null);
  };

  const handleRemoveExam = async () => {
    if (!examToRemove) return;
    setIsRemoving(true);
    try {
      await removeClinicExam(clinicId, examToRemove.id);
      const updatedExams = exams.filter((e) => e.id !== examToRemove.id);
      setExams(updatedExams);
      onChange(updatedExams);
      setExamToRemove(null);
    } catch (error) {
      console.error("Erro ao remover exame:", error);
      setRemoveError("Não foi possível remover o exame. Tente novamente.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {" "}
        {!isEditingExternally ? (
          <div className="flex justify-end mb-2">
            <button
              onClick={onEdit}
              className="text-gray-600 hover:text-[#2D39A6] font-medium"
              type="button"
            >
              Editar Exames
            </button>
          </div>
        ) : null}
        {exams.length === 0 ? (
          <p className="text-gray-500 text-base font-normal">
            Nenhum exame cadastrado.
          </p>
        ) : (
          <ul className="list-disc list-inside text-gray-800 space-y-2 max-h-64 overflow-auto">
            {exams.map((exam) => (
              <li
                key={exam.id}
                className="flex justify-between items-center pr-2 text-black text-base font-medium"
              >
                <span>{exam.name}</span>

                {isEditingExternally && (
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => confirmRemoveExam(exam)}
                  >
                    Remover
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {examToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#2D39A6]">
              Confirmar remoção
            </h3>
            <p className="mb-6">
              Tem certeza que deseja remover o exame:{" "}
              <strong>{examToRemove.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={isRemoving}
              >
                Cancelar
              </button>
              <button
                onClick={handleRemoveExam}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isRemoving}
              >
                {isRemoving ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
