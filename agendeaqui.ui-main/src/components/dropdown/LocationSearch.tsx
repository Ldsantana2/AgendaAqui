import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Select, Spin } from "antd";

interface LocationSearchProps {
  onLocationSelect: (location: { display_name: string; lat: string; lon: string } | null) => void;
  placeholder?: string;
  className?: string;
  initialLocation?: { display_name: string; lat: string; lon: string } | null;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
                                                         onLocationSelect,
                                                         placeholder = "Digite uma cidade ou estado",
                                                         className = "",
                                                         initialLocation = null,
                                                       }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

  // Formata o nome para exibir no Select
  const formatDisplayName = useCallback((location: any) => {
    const address = location.address;
    if (!address) return "";
    const city = address.city || address.town || address.village || address.municipality || "";
    const state = address.state || "";
    if (city && state) return `${city} - ${state}`;
    if (state) return state;
    if (city) return city;
    return "";
  }, []);

  // Busca localizações na API
  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchQuery
          )}&countrycodes=br&limit=5&addressdetails=1`
      );
      const filteredResults = response.data.filter((item: any) => (
          item.address &&
          (item.address.city ||
              item.address.state ||
              item.address.town ||
              item.address.village ||
              item.address.municipality)
      ));
      setResults(filteredResults);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchLocations(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchLocations]);

  // Inicializa valor selecionado
  useEffect(() => {
    if (initialLocation) {
      // Use formatted city-state instead of display_name which shows coordinates
      const formattedLocation = formatDisplayName(initialLocation);
      setSelectedValue(formattedLocation);
      setQuery(formattedLocation);
    }
  }, [initialLocation, formatDisplayName]);

  // Ao selecionar uma opção
  const handleSelect = (value: string) => {
    const location = results.find((loc) => loc.display_name === value);
    if (location) {
      const formattedLocation = formatDisplayName(location);
      setSelectedValue(formattedLocation);
      onLocationSelect(location);
      setQuery(formattedLocation);
    }
  };

  // Ao digitar
  const handleSearch = (value: string) => {
    setQuery(value);
  };

  // Limpar seleção
  const handleClear = () => {
    setSelectedValue(undefined);
    setQuery("");
    setResults([]);
    onLocationSelect(null);
  };

  return (
      <Select
          showSearch
          value={selectedValue}
          placeholder={placeholder}
          notFoundContent={isLoading ? <Spin size="small" /> : "Nenhum resultado"}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleSelect}
          onClear={handleClear}
          allowClear
          className={className}
          style={{ width: "100%" }}
          options={results.map((location) => {
            const formattedLocation = formatDisplayName(location);
            return {
              value: location.display_name, // Keep original value for finding the location object
              label: formattedLocation || location.display_name, // Show formatted location or fallback
            };
          })}
      />
  );
};

export default LocationSearch;