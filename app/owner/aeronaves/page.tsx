"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AircraftFilterBar, AircraftFilters } from "./_components/AircraftFilterBar";
import { AircraftTable, Aircraft } from "./_components/AircraftTable";
import { AircraftPagination } from "./_components/AircraftPagination";
import { Plus } from "lucide-react";

// Mock data - en producción esto vendría de una API
const allAircraft: Aircraft[] = [
  {
    id: "1",
    name: "Gulfstream G650",
    base: "Madrid (MAD)",
    capacity: "14 pasajeros",
    type: "jet",
    status: "active",
    registration: "EC-MBX",
  },
  {
    id: "2",
    name: "Bombardier Global 7500",
    base: "Barcelona (BCN)",
    capacity: "16 pasajeros",
    type: "jet",
    status: "active",
    registration: "EC-NBR",
  },
  {
    id: "3",
    name: "Citation CJ3+",
    base: "Madrid (MAD)",
    capacity: "8 pasajeros",
    type: "light",
    status: "active",
    registration: "EC-LJK",
  },
  {
    id: "4",
    name: "Phenom 300",
    base: "Sevilla (SVQ)",
    capacity: "8 pasajeros",
    type: "light",
    status: "maintenance",
    registration: "EC-KPM",
  },
  {
    id: "5",
    name: "Legacy 500",
    base: "Barcelona (BCN)",
    capacity: "12 pasajeros",
    type: "jet",
    status: "active",
    registration: "EC-MZY",
  },
  {
    id: "6",
    name: "King Air 350",
    base: "Málaga (AGP)",
    capacity: "11 pasajeros",
    type: "turboprop",
    status: "active",
    registration: "EC-HRT",
  },
  {
    id: "7",
    name: "Cessna Citation XLS+",
    base: "Madrid (MAD)",
    capacity: "9 pasajeros",
    type: "light",
    status: "inactive",
    registration: "EC-JWS",
  },
  {
    id: "8",
    name: "Falcon 2000LXS",
    base: "Barcelona (BCN)",
    capacity: "10 pasajeros",
    type: "jet",
    status: "active",
    registration: "EC-OPL",
  },
];

export default function AircraftListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<AircraftFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar aeronaves
  const filteredAircraft = allAircraft.filter((aircraft) => {
    if (filters.base) {
      const baseMap: Record<string, string> = {
        madrid: "Madrid (MAD)",
        barcelona: "Barcelona (BCN)",
        sevilla: "Sevilla (SVQ)",
        malaga: "Málaga (AGP)",
      };
      if (aircraft.base !== baseMap[filters.base]) {
        return false;
      }
    }
    if (filters.type && aircraft.type !== filters.type) {
      return false;
    }
    if (filters.capacity) {
      const capacityNum = parseInt(aircraft.capacity);
      const capacityMap: Record<string, (num: number) => boolean> = {
        small: (num) => num <= 8,
        medium: (num) => num >= 9 && num <= 16,
        large: (num) => num >= 17,
      };
      if (!capacityMap[filters.capacity](capacityNum)) {
        return false;
      }
    }
    if (filters.status && aircraft.status !== filters.status) {
      return false;
    }
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAircraft.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAircraft = filteredAircraft.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    router.push(`/owner/aeronaves/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/owner/aeronaves/${id}/edit`);
  };

  const handleNewAircraft = () => {
    router.push("/owner/aeronaves/nuevo");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header */}
      <div className="px-12 py-8">
        <h1 className="text-[26px] font-semibold text-text">Aeronaves</h1>
        <p className="text-small text-muted mt-2">Gestión de tu flota</p>
      </div>

      {/* Filter Bar */}
      <AircraftFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Content Section */}
      <div className="px-12 py-0 flex flex-col gap-[18px]">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-small font-semibold text-text">Flota activa</h2>
          <button
            onClick={handleNewAircraft}
            className="h-10 px-4 rounded-xl bg-text text-white text-small font-medium hover:bg-text/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva aeronave
          </button>
        </div>

        {/* Aircraft Table */}
        <AircraftTable aircraft={paginatedAircraft} onView={handleView} onEdit={handleEdit} />

        {/* Pagination */}
        <AircraftPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAircraft.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
