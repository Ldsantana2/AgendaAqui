import React, { useRef, useState, useEffect } from "react";
import { Card, Typography } from "antd";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import {
  getClinicReviews,
  getClinicsByCity,
} from "../../services/ClinicService";
import LoadingOverlay from "../LoadingOverlay";
import { ClinicLocation } from "../../entities/ClinicLocation";
import AprovedByAgendaqui from "../AprovedByAgendaqui";
import ClinicRating from "../ClinicRating";
import { useRouter } from "next/router";
import { Clinic } from "../../entities/Clinic";
const { Title, Text } = Typography;

interface MelhoresClinicasProps {
  selectedLocation?: any;
  bestClinics: any[];
}

export default function ClinicasMaisAvaliadas({
  selectedLocation,
  bestClinics,
}: MelhoresClinicasProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const maxIndex = bestClinics.length - 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Função que faz scroll suave para o índice específico
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev < maxIndex ? prev + 1 : prev;
      scrollToIndex(nextIndex);
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev > 0 ? prev - 1 : 0;
      scrollToIndex(prevIndex);
      return prevIndex;
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollAmount = container.clientWidth;
      const newIndex = Math.round(container.scrollLeft / scrollAmount);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener("scroll", onScroll);

    return () => container.removeEventListener("scroll", onScroll);
  }, [currentIndex]);

  const getCityName = () => {
    const city =
      selectedLocation?.address?.city ||
      selectedLocation?.address?.town ||
      selectedLocation?.address?.village ||
      selectedLocation?.address?.municipality;

    return city ? `em ${city}` : "do Brasil";
  };

  const formatAddress = (clinic: Clinic) => {
    if (!clinic.locations || clinic.locations.length === 0) {
      return "Endereço não disponível";
    }

    const location = clinic.locations[0];
    const address = location.address || "Endereço não informado";
    const number = location.number || "s/n"; // s/n = sem número

    return `${address}, Nº ${number}`;
  };

  return (
    <>
      {bestClinics.length > 0 && (
        <div className="py-12 px-4 sm:px-8 bg-white">
          <Title level={2} className="text-center mb-8">
            Clínicas mais avaliadas {getCityName()}
          </Title>

          <div className="relative max-w-7xl mx-auto">
            {/* Botões */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow border border-gray-300
                ${currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <FaChevronLeft className="text-[#2D39A6]" size={24} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              className={`absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow border border-gray-300
                ${currentIndex === maxIndex ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <FaChevronRight className="text-[#2D39A6]" size={24} />
            </button>

            {/* Carrossel */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bestClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="flex-shrink-0 w-[90vw] sm:w-72 snap-center px-2 transform transition duration-300 cursor-pointer"
                  onClick={async () => {
                    await router.push(`/clinic/${clinic.id}`);
                  }}
                >
                  <Card
                    className="shadow-md"
                    cover={
                      <div
                        className="relative h-48 bg-gray-300 bg-cover bg-center"
                        style={{
                          backgroundImage:
                            'url("/images/clinic-card-image.jpg")',
                        }}
                      >
                        <AprovedByAgendaqui />
                      </div>
                    }
                  >
                    <div className="flex items-center justify-between">
                      <Title level={4} className="mb-1">
                        {clinic.name}
                      </Title>
                      <ClinicRating rating={clinic.averageRating} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt
                        className="text-[#6C727F] flex-shrink-0"
                        size={16}
                      />
                      <Text
                        className="text-[#6C727F] block max-w-[85%]"
                        ellipsis={{ tooltip: formatAddress(clinic) }}
                      >
                        {formatAddress(clinic)}
                      </Text>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
