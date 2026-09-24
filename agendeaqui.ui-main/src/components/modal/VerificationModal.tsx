import React, { useState } from "react";
import { message } from "antd";
import { ClinicDoctor } from "../../entities/ClinicDoctor";
import {
  verifyDoctorPin,
  CheckDoctorCodeResponse,
  regenerateDoctorCode,
} from "../../services/ClinicService";

interface VerificationModalProps {
  doctor: ClinicDoctor;
  onClose: () => void;
  onSuccess: () => void;
  clinicId?: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  doctor,
  onClose,
  onSuccess,
  clinicId: initialClinicId,
}) => {
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ pin?: string }>({});
  const [codeInfo, setCodeInfo] = useState<CheckDoctorCodeResponse | null>(
    null,
  );
  const [clinicId, setClinicId] = useState<string | null>(
    initialClinicId || null,
  );
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validatePinCode = () => {
    const errors: { pin?: string } = {};

    if (!pinCode.trim()) {
      errors.pin = "O código PIN é obrigatório";
    } else if (pinCode.length !== 6) {
      errors.pin = "O código PIN deve ter 6 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateNewCode = async () => {
    setGeneratingCode(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await regenerateDoctorCode({
        email: doctor.email,
      });

      // Set the new code in the input field
      if (response.code) {
        setPinCode(response.code);
        setCodeGenerated(true);

        // Update the codeInfo with the new code information
        const newCodeInfo: CheckDoctorCodeResponse = {
          isValid: true,
          isExpired: false,
          doctorId: codeInfo?.doctorId,
          clinicId: clinicId,
          clinicName: codeInfo?.clinicName,
          expiresAt: response.expiresAt,
          code: response.code,
        };

        setCodeInfo(newCodeInfo);

        // Clear error to remove the error message and button
        setError(null);

        // Set success message
        setSuccessMessage("Novo código enviado");
      } else {
        setError("Falha ao gerar novo código. Tente novamente.");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Falha ao gerar novo código. Tente novamente.";
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePinCode()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Directly call verifyDoctorPin without checking the code first
      const response = await verifyDoctorPin({
        code: pinCode,
        email: doctor.email,
      });

      // Display success message from API if available
      const successMsg = response.message || "Médico verificado com sucesso!";

      // Set success message in the component
      setSuccessMessage(successMsg);

      // Show toast message
      message.success(successMsg);

      // If the response includes clinic information, store it
      if (response.clinicId) {
        setClinicId(response.clinicId);
      }

      // Update codeInfo with the response data
      if (response.clinicName) {
        const newCodeInfo: CheckDoctorCodeResponse = {
          isValid: true,
          isExpired: false,
          doctorId: response.doctorId,
          clinicId: response.clinicId,
          clinicName: response.clinicName,
          expiresAt: response.expiresAt,
          code: pinCode,
        };
        setCodeInfo(newCodeInfo);
      }

      // PIN verification successful
      onSuccess();

      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      // Use the specific error message from the API if available
      const errorMessage =
        err.message ||
        "Falha na verificação do PIN. Por favor, verifique o código e tente novamente.";

      // Check if the message is actually a success message about doctor activation
      if (
        errorMessage.includes("Médico ativado com sucesso") ||
        errorMessage.includes("vinculado à clínica")
      ) {
        setSuccessMessage(errorMessage);
        // Call onSuccess to refresh the doctors list
        onSuccess();
        // Close the modal after a short delay to show the success message
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      // Check for specific error messages indicating expired or invalid code
      else if (
        errorMessage.includes("expirado") ||
        errorMessage.includes("Expirado")
      ) {
        setError("Código Expirado");
      } else if (
        errorMessage.includes("não existe") ||
        errorMessage.includes("inválido") ||
        errorMessage.includes("invalido")
      ) {
        setError("Código não existe");
      } else {
        setError(errorMessage);
      }

      // Try to extract clinicId from the error response if available
      if (err.response?.data?.clinicId) {
        setClinicId(err.response.data.clinicId);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2D39A6]">
            Verificação do Médico
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="mt-1">
            Um código de verificação de 6 dígitos foi enviado para o email{" "}
            {doctor.email}.<br /> <br /> Por favor, insira o código abaixo para
            verificar a conta.
          </p>
        </div>

        {successMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <span className="font-medium">{successMessage}</span>
          </div>
        ) : (
          error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{error}</span>
                {((error === "Código Expirado" && clinicId) ||
                  error === "Código não existe") && (
                  <button
                    type="button"
                    onClick={handleGenerateNewCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={generatingCode}
                  >
                    {generatingCode ? "Gerando..." : "Gerar novo código"}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {codeInfo &&
          codeInfo.isValid &&
          !codeInfo.isExpired &&
          codeInfo.clinicName && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Código válido</p>
              <p className="mt-1">
                Este código é válido para vincular o médico à clínica:{" "}
                <strong>{codeInfo.clinicName}</strong>
                {codeInfo.expiresAt && (
                  <span className="block mt-1">
                    Expira em: {new Date(codeInfo.expiresAt).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
          )}

        <form onSubmit={handleVerifyPin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código PIN (6 dígitos)
            </label>
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              maxLength={6}
              placeholder="Digite o código de 6 dígitos"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#2D39A6] focus:border-[#2D39A6] text-center text-lg tracking-widest"
              disabled={loading}
            />
            {formErrors.pin && (
              <p className="mt-1 text-sm text-red-600">{formErrors.pin}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D39A6]"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
