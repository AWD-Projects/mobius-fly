"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { CrewFilterBar, CrewFilters } from "./_components/CrewFilterBar";
import { CrewCard, CrewMember } from "./_components/CrewCard";
import { CrewPagination } from "./_components/CrewPagination";
import { Plus } from "lucide-react";

// Mock data - en producción esto vendría de una API
const allCrewMembers: CrewMember[] = [
  {
    id: "1",
    name: "Carlos Pérez",
    role: "Capitán / Piloto",
    base: "Madrid (MAD)",
    licenses: ["ATPL", "IR", "ME"],
    status: "active",
  },
  {
    id: "2",
    name: "María García",
    role: "Copiloto / Piloto",
    base: "Barcelona (BCN)",
    licenses: ["CPL", "IR"],
    status: "active",
  },
  {
    id: "3",
    name: "Ana Blanco",
    role: "TCP / Sobrecargo",
    base: "Sevilla (SVQ)",
    licenses: ["CCA"],
    status: "active",
  },
  {
    id: "4",
    name: "Juan Romero",
    role: "Copiloto / Piloto",
    base: "Madrid (MAD)",
    licenses: ["CPL", "IR"],
    status: "pending",
  },
  {
    id: "5",
    name: "Laura Martínez",
    role: "Capitán / Piloto",
    base: "Barcelona (BCN)",
    licenses: ["ATPL", "IR", "ME"],
    status: "active",
  },
  {
    id: "6",
    name: "Pedro Sánchez",
    role: "TCP / Sobrecargo",
    base: "Madrid (MAD)",
    licenses: ["CCA"],
    status: "inactive",
  },
  {
    id: "7",
    name: "Isabel Torres",
    role: "Copiloto / Piloto",
    base: "Sevilla (SVQ)",
    licenses: ["CPL", "IR"],
    status: "active",
  },
  {
    id: "8",
    name: "Roberto Díaz",
    role: "Capitán / Piloto",
    base: "Barcelona (BCN)",
    licenses: ["ATPL", "IR", "ME"],
    status: "active",
  },
];

export default function CrewListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<CrewFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filtrar tripulación
  const filteredMembers = allCrewMembers.filter((member) => {
    if (filters.role) {
      const roleMap: Record<string, string[]> = {
        pilot: ["Capitán / Piloto"],
        copilot: ["Copiloto / Piloto"],
        "cabin-crew": ["TCP / Sobrecargo"],
      };
      if (roleMap[filters.role] && !roleMap[filters.role].includes(member.role)) {
        return false;
      }
    }
    if (filters.base) {
      const baseMap: Record<string, string> = {
        madrid: "Madrid (MAD)",
        barcelona: "Barcelona (BCN)",
        sevilla: "Sevilla (SVQ)",
      };
      if (member.base !== baseMap[filters.base]) {
        return false;
      }
    }
    if (filters.status && member.status !== filters.status) {
      return false;
    }
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    router.push(`/owner/tripulacion/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/owner/tripulacion/${id}/edit`);
  };

  const handleNewCrew = () => {
    router.push("/owner/tripulacion/nuevo");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header */}
      <div className="px-12 py-8">
        <h1 className="text-[26px] font-semibold text-text">Tripulación</h1>
        <p className="text-small text-muted mt-2">Gestión de tu tripulación</p>
      </div>

      {/* Filter Bar */}
      <CrewFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Content Section */}
      <div className="px-12 py-0 flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-small font-semibold text-text">Tripulación disponibles</h2>
          <Button
            onClick={handleNewCrew}
            variant="primary"
            className="h-10 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva tripulación
          </Button>
        </div>

        {/* Crew Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedMembers.map((member) => (
            <CrewCard
              key={member.id}
              member={member}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* Pagination */}
        <CrewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
