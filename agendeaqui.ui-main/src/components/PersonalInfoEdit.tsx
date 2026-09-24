import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  name: string;
  surname: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  cpf: string;
  setName: Dispatch<SetStateAction<string>>;
  setSurname: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setDateOfBirth: Dispatch<SetStateAction<string>>;
  setGender: Dispatch<SetStateAction<string>>;
  setCpf: Dispatch<SetStateAction<string>>;
  onSave?: () => void;
  onCancel?: () => void;
}

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length !== 11) return digits;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 11) return digits;
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export default function PersonalInfoForm({
  name,
  surname,
  phone,
  dateOfBirth,
  gender,
  cpf,
  setName,
  setSurname,
  setPhone,
  setDateOfBirth,
  setGender,
  onSave,
  onCancel,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#2D39A6]">
        Informações Pessoais
      </h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 font-semibold text-gray-700">
            Nome
          </label>
          <input
            id="name"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="surname" className="mb-1 font-semibold text-gray-700">
            Sobrenome
          </label>
          <input
            id="surname"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Sobrenome"
            value={surname}
            onChange={(e) =>
              setSurname(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-1 font-semibold text-gray-700">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            pattern="\d*"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Telefone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
            onBlur={() => setPhone(formatPhone(phone))}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="dateOfBirth"
            className="mb-1 font-semibold text-gray-700"
          >
            Data de Nascimento
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={new Date().toISOString().split("T")[0]} // impede datas futuras
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-1 font-semibold text-gray-700">
            Gênero
          </label>
          <select
            id="gender"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Selecione o gênero</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Não-Binário">Não-Binário</option>
            <option value="Transgenero">Transgênero</option>
            <option value="Agênero">Agenero</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="cpf" className="mb-1 font-semibold text-gray-700">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={14}
            readOnly
            className="border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-700"
            placeholder="CPF"
            value={formatCPF(cpf || "")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Descartar Alterações
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded bg-[#2D39A6] text-white hover:bg-[#283277]"
        >
          Salvar
        </button>
      </div>
    </section>
  );
}
