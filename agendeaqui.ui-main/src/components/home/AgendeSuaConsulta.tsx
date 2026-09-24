"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import LocationSearch from "../dropdown/LocationSearch";
import { DatePicker, Select, Button, Radio, Form, Typography } from "antd";
const { Option } = Select;
const { Text } = Typography;
import moment from "moment";
import AdvancedFiltersModal from "../modal/AdvancedFiltersModal";
import Fuse from "fuse.js";
import SearchIndex from "./SearchIndex";

interface SearchDataIndex {
  clinics: {
    id: string,
    name: string,
    about: string
  }[],
  doctors: {
    doctor: {
      id: string,
      name: string,
      surmane: string
    }
  }[],
  specialities: {
    id: string,
    name: string
  }[],
  clinic
}

export default function SearchSection({
  searchForIndex,
  healthPlanMode,
  setHealthPlanMode,
  healthPlan,
  setHealthPlan,
  healthOperators,
  specialty,
  setSpecialty,
  specialties,
  selectedLocation,
  setSelectedLocation,
  geoLocationLoading,
  handleSearch,
  serviceType = "consultas",
  dateRange,
  setDateRange,
}: any) {


  const [form] = Form.useForm();
  const [isAdvancedFiltersVisible, setIsAdvancedFiltersVisible] =
    useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    neighborhood: "",
  });

  useEffect(() => {
    if (healthPlanMode === "particular" && healthPlan) {
      setHealthPlan(undefined);
    }
  }, [healthPlanMode, setHealthPlan, healthPlan]);

  const handleApplyAdvancedFilters = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleDateChange = (index: number, date: any) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = date;
    setDateRange(newDateRange);
    form.setFieldsValue({ dateRange: newDateRange });
  };

  return (
    <div className="relative">
      <AdvancedFiltersModal
        isVisible={isAdvancedFiltersVisible}
        onClose={() => setIsAdvancedFiltersVisible(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        initialFilters={advancedFilters}
      />

      <div className="py-12 px-8 pb-32" style={{ backgroundColor: "#2D39A6" }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 text-left">
                  {serviceType === "consultas" ? (
                    <>Agende agora sua próxima consulta!</>
                  ) : (
                    <>Agende agora seu exame!</>
                  )}
                </h2>
                <p className="text-lg text-white">
                  {serviceType === "consultas" ? (
                    <>
                      Mais de 10 mil clínicas de saúde estão prontas para te
                      atender.
                    </>
                  ) : (
                    <>
                      Mais de 5 mil laboratórios prontos para realizar seus
                      exames.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-24">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setSpecialty(values.specialty);
            setDateRange(values.dateRange || [null, null]);
            handleSearch({
              preventDefault: () => { },
              ...values,
              advancedFilters: advancedFilters,
            });
          }}
          initialValues={{
            specialty: specialty || "",
            healthPlan: healthPlan || "",
            dateRange: dateRange,
          }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="mb-4">
            <Form.Item style={{ marginBottom: 0 }}>
              <Radio.Group
                value={healthPlanMode}
                onChange={(e) => setHealthPlanMode(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                className="custom-radio-group"
                style={{ border: "none" }}
              >
                <Radio
                  value="particular"
                  style={
                    healthPlanMode === "particular"
                      ? {
                        color: "#283277",
                        backgroundColor: "#DFECFF",
                        borderRadius: "8px",
                        border: "none",
                        outline: "none",
                      }
                      : {
                        border: "none",
                        outline: "none",
                      }
                  }
                >
                  Particular
                </Radio>
                <Radio
                  value="convenio"
                  style={
                    healthPlanMode === "convenio"
                      ? {
                        color: "#283277",
                        backgroundColor: "#DFECFF",
                        borderRadius: "8px",
                        border: "none",
                        outline: "none",
                      }
                      : {
                        border: "none",
                        outline: "none",
                      }
                  }
                >
                  Convênio
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            {healthPlanMode === "convenio" && (
              <Form.Item
                name="healthPlan"
                label="Escolha uma operadora:"
                style={{ marginBottom: 0, width: 220 }}
                rules={[{ required: true, message: "" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toString()
                      .toLowerCase()
                      .includes(input.toLowerCase()) || false
                  }
                >
                  <Option value="">Selecione uma operadora...</Option>
                  {healthOperators?.map((operator: any) => (
                    <Option
                      key={operator.id}
                      value={operator.id}
                      label={operator.operatorCompanyName}
                    >
                      {operator.operatorCompanyName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <div className="flex flex-col">
              <label className="block text-sm mb-1">
                <span>
                  {serviceType === "consultas"
                    ? "Buscar por:"
                    : "Tipo de Exame"}
                </span>
                <span className="text-red-500 ml-1">*</span>
              </label>

              <Form.Item
                name="selectedItem"
                rules={[{ required: true, message: "Selecione uma opção" }]}
                style={{ marginBottom: 0 }}
              >
                <SearchIndex
                  searchForIndex={searchForIndex}
                  onItemSelect={(item) => {
                    form.setFieldsValue({ selectedItem: item });
                  }}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Localização"
              style={{ marginBottom: 0, width: 192 }}
            >
              <LocationSearch
                onLocationSelect={(location: any) => {
                  setSelectedLocation(location);
                  if (location) {
                    localStorage.setItem(
                      "userLocation",
                      JSON.stringify(location),
                    );
                  } else {
                    localStorage.removeItem("userLocation");
                  }
                }}
                placeholder="Digite uma cidade ou estado"
                initialLocation={selectedLocation}
              />
            </Form.Item>

            <div className="flex flex-col">
              <Form.Item name="dateRange" noStyle>
                {/* Versão desktop - RangePicker tradicional */}
                <div className="hidden sm:block">
                  <DatePicker.RangePicker
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: "HH:mm" }}
                    allowClear
                    placeholder={["Data e hora inicial", "Data e hora final"]}
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                    style={{ width: "320px" }}
                  />
                </div>

                {/* Versão mobile - Dois DatePickers separados lado a lado */}
                <div className="sm:hidden flex flex-row gap-2">
                  <DatePicker
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: "HH:mm" }}
                    allowClear
                    placeholder="De"
                    value={dateRange[0] ? moment(dateRange[0]) : null}
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                    style={{ width: "100%" }}
                    onChange={(date) => handleDateChange(0, date)}
                  />
                  <DatePicker
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: "HH:mm" }}
                    allowClear
                    placeholder="Até"
                    value={dateRange[1] ? moment(dateRange[1]) : null}
                    disabledDate={(current) => {
                      const startDate = dateRange[0];
                      return (
                        (current && current < moment().startOf("day")) ||
                        (startDate &&
                          current &&
                          current.isBefore(startDate, "day"))
                      );
                    }}
                    style={{ width: "100%" }}
                    onChange={(date) => handleDateChange(1, date)}
                  />
                </div>
              </Form.Item>
            </div>

            <div className="flex flex-col">
              <Text
                className="cursor-pointer flex items-center"
                style={{ color: "#2D39A6" }}
                onClick={() => setIsAdvancedFiltersVisible(true)}
              >
                <FaPlus className="mr-1" size={12} /> Recursos Avançados
              </Text>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<FaSearch />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#2D39A6",
                  borderColor: "#2D39A6",
                  width: 107,
                  height: 40,
                  borderRadius: 16,
                  opacity: 1,
                  gap: 8,
                  padding: "12px 16px 12px 16px",
                }}
              >
                {serviceType === "consultas" ? "Buscar" : "Buscar"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
