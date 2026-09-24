"use client";

import React from "react";

export interface AddressInfo {
  address?: string;
  number?: string;
  complement?: string;
  zipCode?: string;
  city?: string;
  state?: string;
}

interface PatientAddressEditProps {
  addressInfo: AddressInfo;
  setAddressInfo: React.Dispatch<React.SetStateAction<AddressInfo>>;
  onCepBlur?: (cep: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function PatientAddressEdit({
  addressInfo,
  setAddressInfo,
  onCepBlur,
  onSave,
  onCancel,
}: PatientAddressEditProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#2D39A6]">Endereço</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label htmlFor="zipCode" className="mb-1 font-semibold text-gray-700">
            CEP
          </label>
          <input
            id="zipCode"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="CEP"
            value={addressInfo.zipCode || ""}
            maxLength={8}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 8);
              setAddressInfo((prev) => ({ ...prev, zipCode: onlyNumbers }));
            }}
            onBlur={() => onCepBlur?.(addressInfo.zipCode || "")}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 font-semibold text-gray-700">
            Logradouro
          </label>
          <input
            id="address"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Logradouro"
            value={addressInfo.address || ""}
            onChange={(e) =>
              setAddressInfo((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1 font-semibold text-gray-700">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Cidade"
            value={addressInfo.city || ""}
            onChange={(e) =>
              setAddressInfo((prev) => ({ ...prev, city: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="state" className="mb-1 font-semibold text-gray-700">
            Estado
          </label>
          <select
            id="state"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            value={addressInfo.state || ""}
            onChange={(e) =>
              setAddressInfo((prev) => ({ ...prev, state: e.target.value }))
            }
          >
            <option value="">Selecione o estado</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="number" className="mb-1 font-semibold text-gray-700">
            Número
          </label>
          <input
            id="number"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Número"
            value={addressInfo.number || ""}
            onChange={(e) =>
              setAddressInfo((prev) => ({ ...prev, number: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="complement"
            className="mb-1 font-semibold text-gray-700"
          >
            Complemento
          </label>
          <input
            id="complement"
            type="text"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
            placeholder="Complemento"
            value={addressInfo.complement || ""}
            onChange={(e) =>
              setAddressInfo((prev) => ({
                ...prev,
                complement: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
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
