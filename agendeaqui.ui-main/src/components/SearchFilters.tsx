"use client";

import React, { useState, useEffect } from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import FilterDrawer from "./drawer/FilterDrawer";
import { findAll } from "../services/examService";
import { Clinic } from "../entities/Clinic";

interface Exam {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  healthOperators?: any[];
  onSearch: (filters: {
    selectedPlan: string;
    selectedDate: string;
    startDate?: string;
    endDate?: string;
    selectedService: string;
    selectedDisease: string;
    selectedPayment: string;
    selectedExams: string[];
    sortOrder: "relevance" | "name_asc" | "name_desc";
  }) => void;
  onClinicsFound: (clinics: Clinic[]) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  healthOperators = [],
  onSearch,
  onClinicsFound,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState<
    "today" | "next3days" | null
  >(null);

  const [examsList, setExamsList] = useState<Exam[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState<
    "relevance" | "name_asc" | "name_desc"
  >("relevance");

  useEffect(() => {
    findAll()
      .then(setExamsList)
      .catch((err) => console.error("Erro ao carregar exames:", err));
  }, []);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
    setActiveQuickFilter(null);
  };

  const handleSort = () => {
    setSortOrder((prev) =>
      prev === "relevance"
        ? "name_asc"
        : prev === "name_asc"
          ? "name_desc"
          : "relevance",
    );
  };

  const handleApplyFilters = () => {
    setIsDrawerOpen(false);
    setActiveQuickFilter(null);

    let startDateValue;
    let endDateValue;

    if (selectedDate) {
      startDateValue = `${selectedDate}T00:00:00`;
      endDateValue = `${selectedDate}T23:59:59`;
    }

    onSearch({
      selectedPlan,
      selectedDate,
      startDate: startDateValue,
      endDate: endDateValue,
      selectedService,
      selectedDisease,
      selectedPayment,
      selectedExams,
      sortOrder,
    });
  };

  const handleQuickFilterToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const startDate = `${todayStr}T00:00:00`;
    const endDate = `${todayStr}T23:59:59`;

    setSelectedDate(todayStr);
    setActiveQuickFilter("today");

    onSearch({
      selectedPlan,
      selectedDate: todayStr,
      startDate,
      endDate,
      selectedService,
      selectedDisease,
      selectedPayment,
      selectedExams,
      sortOrder,
    });
  };

  const handleQuickFilterNext3Days = () => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const todayStr = today.toISOString().split("T")[0];
    const twoDaysLaterStr = twoDaysLater.toISOString().split("T")[0];

    const startDate = `${todayStr}T00:00:00`;
    const endDate = `${twoDaysLaterStr}T23:59:59`;

    setSelectedDate(todayStr);
    setActiveQuickFilter("next3days");

    onSearch({
      selectedPlan,
      selectedDate: todayStr,
      startDate,
      endDate,
      selectedService,
      selectedDisease,
      selectedPayment,
      selectedExams,
      sortOrder,
    });
  };

  return (
    <div>
      <div className="bg-white text-black py-3 px-4 flex flex-wrap justify-start gap-6">
        <button
          onClick={handleQuickFilterToday}
          className={`flex items-center px-3 py-1 rounded-md ${
            activeQuickFilter === "today"
              ? "bg-[#2D39A6] text-white hover:bg-[#1f2975]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span>Hoje</span>
        </button>

        <button
          onClick={handleQuickFilterNext3Days}
          className={`flex items-center px-3 py-1 rounded-md ${
            activeQuickFilter === "next3days"
              ? "bg-[#2D39A6] text-white hover:bg-[#1f2975]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span>Próximos 3 dias</span>
        </button>

        <button
          onClick={handleOpenDrawer}
          className="flex items-center text-gray-700"
        >
          <FaFilter className="mr-2" />
          <span>Filtros</span>
        </button>

        <button
          onClick={handleSort}
          className="flex items-center text-gray-700"
        >
          <FaSort className="mr-2" />
          <span>
            Ordenar{" "}
            {sortOrder === "relevance"
              ? "(Relevância)"
              : sortOrder === "name_asc"
                ? "(A-Z)"
                : "(Z-A)"}
          </span>
        </button>
      </div>

      {selectedExams.length > 0 && (
        <div className="p-4 flex flex-wrap gap-2 bg-white border-b border-gray-200">
          {selectedExams.map((id) => {
            const exam = examsList.find((e) => e.id === id);
            if (!exam) return null;
            return (
              <span
                key={id}
                className="bg-[#e5e7fa] text-[#2D39A6] px-3 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                {exam.name}
                <button
                  onClick={() =>
                    setSelectedExams((prev) => prev.filter((e) => e !== id))
                  }
                  aria-label={`Remover exame ${exam.name}`}
                  className="hover:text-[#1f2975]"
                  type="button"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApplyFilters={handleApplyFilters}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        exams={examsList}
        selectedExams={selectedExams}
        onChangeSelectedExams={setSelectedExams}
        healthOperators={healthOperators}
      />
    </div>
  );
};

export default SearchFilters;
