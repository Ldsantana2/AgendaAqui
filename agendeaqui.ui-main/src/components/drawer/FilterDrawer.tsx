"use client";
import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Form, Select } from "antd";

interface Exam {
  id: string;
  name: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: () => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  selectedDisease: string;
  setSelectedDisease: (disease: string) => void;
  selectedPayment: string;
  setSelectedPayment: (payment: string) => void;
  exams: Exam[];
  selectedExams: string[];
  onChangeSelectedExams: (exams: string[]) => void;
  healthOperators?: any[];
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  selectedPlan,
  setSelectedPlan,
  selectedDate,
  setSelectedDate,
  selectedService,
  setSelectedService,
  selectedDisease,
  setSelectedDisease,
  selectedPayment,
  setSelectedPayment,
  healthOperators = [],
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Use healthOperators instead of hardcoded plans
  const availableDates = ["Hoje", "Próximos 3 dias", "Qualquer data"];
  const servicesOptions = ["Serviço 1", "Serviço 2"];
  const diseasesOptions = ["Doença 1", "Doença 2"];
  const paymentMethodsOptions = ["Cartão", "Dinheiro", "Pix"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.querySelector(".ant-select-dropdown");
        if (
          dropdown &&
          (dropdown.contains(event.target as Node) ||
            document.body.classList.contains("ant-select-open"))
        ) {
          return;
        }
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleDropdownVisibility = (open: boolean) => {
    if (open) {
      document.body.classList.add("ant-select-open");
    } else {
      document.body.classList.remove("ant-select-open");
    }
  };

  const handleApplyFilters = () => {
    if (typeof onApplyFilters === "function") {
      onApplyFilters();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-start transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={drawerRef}
        className={`drawer bg-white w-80 max-w-full h-full p-6 overflow-hidden relative shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Fechar filtro"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="content">
          <Form layout="vertical">
            <Form.Item label="Plano">
              <Select
                placeholder="Selecione..."
                value={selectedPlan || undefined}
                onChange={setSelectedPlan}
                options={healthOperators.map((op) => ({
                  label: op.operatorCompanyName,
                  value: op.id,
                }))}
                dropdownMatchSelectWidth={false}
                placement="bottomLeft"
                onDropdownVisibleChange={handleDropdownVisibility}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Data">
              <Select
                placeholder="Selecione..."
                value={selectedDate || undefined}
                onChange={setSelectedDate}
                options={availableDates.map((d) => ({ label: d, value: d }))}
                dropdownMatchSelectWidth={false}
                placement="bottomLeft"
                onDropdownVisibleChange={handleDropdownVisibility}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Serviço">
              <Select
                placeholder="Selecione..."
                value={selectedService || undefined}
                onChange={setSelectedService}
                options={servicesOptions.map((s) => ({ label: s, value: s }))}
                dropdownMatchSelectWidth={false}
                placement="bottomLeft"
                onDropdownVisibleChange={handleDropdownVisibility}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Doença">
              <Select
                placeholder="Selecione..."
                value={selectedDisease || undefined}
                onChange={setSelectedDisease}
                options={diseasesOptions.map((d) => ({ label: d, value: d }))}
                dropdownMatchSelectWidth={false}
                placement="bottomLeft"
                onDropdownVisibleChange={handleDropdownVisibility}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Forma de Pagamento">
              <Select
                placeholder="Selecione..."
                value={selectedPayment || undefined}
                onChange={setSelectedPayment}
                options={paymentMethodsOptions.map((m) => ({
                  label: m,
                  value: m,
                }))}
                dropdownMatchSelectWidth={false}
                placement="bottomLeft"
                onDropdownVisibleChange={handleDropdownVisibility}
                allowClear
              />
            </Form.Item>
          </Form>
        </div>

        <button
          onClick={handleApplyFilters}
          className="w-full py-3 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ver resultados
        </button>

        <style jsx>{`
          .drawer {
            height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .content {
            flex-grow: 1;
            overflow-y: auto;
            padding-bottom: 5px;
          }
          .fixed-footer {
            position: sticky;
            bottom: 0;
            background: white;
            padding: 12px 24px;
            box-shadow: 0 -2px 8px rgb(0 0 0 / 0.1);
            z-index: 20;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FilterDrawer;
