"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FlightsFilterBar, FlightsFilters } from "./_components/FlightsFilterBar";
import { FlightsTable, Flight } from "./_components/FlightsTable";
import { FlightsPagination } from "./_components/FlightsPagination";
import { Plus } from "lucide-react";

// Mock data - en producción esto vendría de una API
const allFlights: Flight[] = [
  {
    id: "1",
    route: "Madrid → Ibiza",
    date: "14 Feb · 10:30",
    aircraft: "Citation CJ3+",
    type: "charter",
    status: "scheduled",
    capacity: "4/8",
  },
  {
    id: "2",
    route: "Barcelona → París",
    date: "14 Feb · 14:00",
    aircraft: "Phenom 300",
    type: "personal",
    status: "in-flight",
    capacity: "6/8",
  },
  {
    id: "3",
    route: "Málaga → Londres",
    date: "15 Feb · 08:00",
    aircraft: "Legacy 500",
    type: "charter",
    status: "scheduled",
    capacity: "8/12",
  },
  {
    id: "4",
    route: "Valencia → Milán",
    date: "15 Feb · 11:30",
    aircraft: "Citation CJ3+",
    type: "personal",
    status: "confirmed",
    capacity: "5/8",
  },
  {
    id: "5",
    route: "Sevilla → Ginebra",
    date: "16 Feb · 09:00",
    aircraft: "Phenom 300",
    type: "charter",
    status: "scheduled",
    capacity: "3/8",
  },
  // Añadimos más vuelos para simular paginación
  {
    id: "6",
    route: "Bilbao → Ámsterdam",
    date: "16 Feb · 15:00",
    aircraft: "Legacy 500",
    type: "charter",
    status: "confirmed",
    capacity: "10/12",
  },
  {
    id: "7",
    route: "Palma → Niza",
    date: "17 Feb · 08:30",
    aircraft: "Citation CJ3+",
    type: "personal",
    status: "scheduled",
    capacity: "6/8",
  },
  {
    id: "8",
    route: "Alicante → Roma",
    date: "17 Feb · 12:00",
    aircraft: "Phenom 300",
    type: "charter",
    status: "in-flight",
    capacity: "7/8",
  },
];

export default function FlightsListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FlightsFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar vuelos
  const filteredFlights = allFlights.filter((flight) => {
    if (filters.aircraft && !flight.aircraft.toLowerCase().includes(filters.aircraft.toLowerCase())) {
      return false;
    }
    if (filters.type && flight.type !== filters.type) {
      return false;
    }
    if (filters.status && flight.status !== filters.status) {
      return false;
    }
    if (filters.origin && !flight.route.toLowerCase().includes(filters.origin.toLowerCase())) {
      return false;
    }
    if (filters.destination && !flight.route.toLowerCase().includes(filters.destination.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFlights = filteredFlights.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    router.push(`/owner/vuelos/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/owner/vuelos/${id}/edit`);
  };

  const handleNewFlight = () => {
    router.push("/owner/vuelos/nuevo");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header */}
      <div className="px-12 py-8">
        <h1 className="text-[26px] font-semibold text-text">Mis vuelos</h1>
        <p className="text-small text-muted mt-2">Resumen operativo de tu flota</p>
      </div>

      {/* Filter Bar */}
      <FlightsFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Content Section */}
      <div className="px-12 py-0 flex flex-col gap-[18px]">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-small font-semibold text-text">Vuelos próximos</h2>
          <button
            onClick={handleNewFlight}
            className="h-10 px-4 rounded-xl bg-text text-white text-small font-medium hover:bg-text/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo vuelo
          </button>
        </div>

        {/* Flights Table */}
        <FlightsTable flights={paginatedFlights} onView={handleView} onEdit={handleEdit} />

        {/* Pagination */}
        <FlightsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredFlights.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
