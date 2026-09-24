import React from "react";
import { useRouter } from "next/navigation";

interface PatientViewCardProps {
  name?: string | null;
  surname?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  profilePicture?: string | null;
  patientId?: string;
}

const PatientViewCard: React.FC<PatientViewCardProps> = ({
  name,
  surname,
  dateOfBirth,
  gender,
  profilePicture,
}) => {
  const router = useRouter();
  const defaultProfilePicture = "/images/user_icon_001.jpg";
  const imageToShow = profilePicture?.trim()
    ? profilePicture
    : defaultProfilePicture;
  const mapGenderToDisplay = (gender: string) => {
    switch (gender) {
      case "male":
        return "Masculino";
      case "female":
        return "Feminino";
      case "other":
        return "Outros";
      default:
        return "Não informado";
    }
  };
  const displayGender = mapGenderToDisplay(gender);
  return (
    <div className="relative">
      {/* Botão editar */}
      <button
        className="absolute top-0 right-0 text-base text-black hover:text-[#2D39A6] font-inter flex items-center"
        onClick={() => router.push("/profile_patient_edit")}
        title="Editar informações"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Editar
      </button>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center">
          {imageToShow !== defaultProfilePicture ? (
            <img
              src={imageToShow}
              alt="Foto de Perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M2.30775 17.5C1.80258 17.5 1.375 17.325 1.025 16.975C0.675 16.625 0.5 16.1974 0.5 15.6923V2.30775C0.5 1.80258 0.675 1.375 1.025 1.025C1.375 0.675 1.80258 0.5 2.30775 0.5H15.6923C16.1974 0.5 16.625 0.675 16.975 1.025C17.325 1.375 17.5 1.80258 17.5 2.30775V15.6923C17.5 16.1974 17.325 16.625 16.975 16.975C16.625 17.325 16.1974 17.5 15.6923 17.5H2.30775ZM2.30775 16H15.6923C15.7692 16 15.8398 15.9679 15.9038 15.9038C15.9679 15.8398 16 15.7692 16 15.6923V2.30775C16 2.23075 15.9679 2.16025 15.9038 2.09625C15.8398 2.03208 15.7692 2 15.6923 2H2.30775C2.23075 2 2.16025 2.03208 2.09625 2.09625C2.03208 2.16025 2 2.23075 2 2.30775V15.6923C2 15.7692 2.03208 15.8398 2.09625 15.9038C2.16025 15.9679 2.23075 16 2.30775 16ZM3.75 13.75H14.3268L11.0385 9.3655L8.23075 13.0192L6.23075 10.4615L3.75 13.75ZM5.5 6.75C5.84617 6.75 6.141 6.62817 6.3845 6.3845C6.62817 6.141 6.75 5.84617 6.75 5.5C6.75 5.15383 6.62817 4.859 6.3845 4.6155C6.141 4.37183 5.84617 4.25 5.5 4.25C5.15383 4.25 4.859 4.37183 4.6155 4.6155C4.37183 4.859 4.25 5.15383 4.25 5.5C4.25 5.84617 4.37183 6.141 4.6155 6.3845C4.859 6.62817 5.15383 6.75 5.5 6.75Z"
                  fill="#1E1F24"
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            id="profilePictureInput"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("Foto selecionada:", file);
              }
            }}
          />

          <button
            className="text-base text-black hover:text-[#2D39A6] font-inter flex items-center"
            onClick={() => {
              const input = document.getElementById("profilePictureInput");
              if (input) input.click();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {profilePicture ? "Editar foto" : "Adicionar foto"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 font-inter">
        <div>
          <span className="text-black text-base">Nome</span>
          <p className="text-black-600 text-base font-semibold">
            {name || "Não informado"}
          </p>
        </div>
        <div>
          <span className="text-black text-base">Sobrenome</span>
          <p className="text-black text-base font-semibold">
            {surname || "Não informado"}
          </p>
        </div>
        <div>
          <span className="text-black text-base">Data de nascimento</span>
          <p className="text-black text-base font-semibold">
            {dateOfBirth
              ? new Date(dateOfBirth).toLocaleDateString("pt-BR")
              : "Não informado"}
          </p>
        </div>
        <div>
          <span className="text-black text-base">Gênero</span>
          <p className="text-black text-base font-semibold">{displayGender}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientViewCard;
