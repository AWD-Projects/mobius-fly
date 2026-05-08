"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { FlightDetailHero } from "./_components/FlightDetailHero";
import { FlightInfoCard } from "./_components/FlightInfoCard";
import { AircraftInfoCard } from "./_components/AircraftInfoCard";
import { CrewInfoCard, CrewMember } from "./_components/CrewInfoCard";
import { AdminControlCard, Passenger } from "./_components/AdminControlCard";

// Mock data - en producción esto vendría de una API
const mockFlightData = {
  "1": {
    id: "MF-2025-0214",
    origin: "Madrid",
    destination: "Ibiza",
    date: "14 Feb 2025 · 10:30",
    status: "scheduled" as const,
    flightType: "Sencillo",
    originInfo: {
      airport: "Madrid (MAD)",
      time: "10:30",
    },
    destinationInfo: {
      airport: "Ibiza (IBZ)",
      time: "12:00",
    },
    fbo: "ExecJet Madrid",
    scheduledDeparture: "14 Feb 2025 · 10:30",
    aircraft: {
      model: "Citation CJ3+",
      registration: "EC-MBX",
      capacity: "8 pasajeros",
    },
    crew: [
      {
        id: "1",
        name: "Carlos Pérez",
        role: "Capitán",
        licenses: ["ATPL", "IR", "ME"],
      },
      {
        id: "2",
        name: "María García",
        role: "Copiloto",
        licenses: ["CPL", "IR"],
      },
    ] as CrewMember[],
    totalSeats: 8,
    soldSeats: 4,
    availableSeats: 4,
    pricePerSeat: "$500.00 MXN",
    passengers: [
      { id: "1", name: "Elena Rodríguez S.", document: "DNI 12345678A" },
      { id: "2", name: "Miguel Fernández L.", document: "Pasaporte ES829374" },
      { id: "3", name: "Ana María Torres", document: "DNI 87654321B" },
      { id: "4", name: "David García Ruiz", document: "NIE X1234567Y" },
    ] as Passenger[],
  },
};

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.id as string;

  // En producción, esto vendría de una API
  const flight = mockFlightData[flightId as keyof typeof mockFlightData];

  if (!flight) {
    return (
      <div className="w-full min-h-screen bg-[#f6f6f4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text mb-2">Vuelo no encontrado</h1>
          <p className="text-sm text-muted">El vuelo que buscas no existe</p>
        </div>
      </div>
    );
  }

  const handleMarkInFlight = () => {
    console.log("Mark flight as in-flight:", flightId);
    // Aquí iría la lógica para marcar el vuelo como en vuelo
  };

  const handleEditFlight = () => {
    console.log("Edit flight:", flightId);
    router.push(`/owner/vuelos/${flightId}/edit`);
  };

  const handleDownloadManifest = () => {
    console.log("Download manifest for flight:", flightId);
    // Aquí iría la lógica para descargar el manifiesto
  };

  const handleViewAircraft = () => {
    router.push("/owner/aeronaves/1");
  };

  const handleViewCrew = () => {
    router.push("/owner/tripulacion/1");
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Hero Section */}
      <FlightDetailHero
        flightId={flight.id}
        origin={flight.origin}
        destination={flight.destination}
        date={flight.date}
        status={flight.status}
      />

      {/* Main Content */}
      <div className="px-12 py-10 flex gap-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8" style={{ maxWidth: "856px" }}>
          {/* Flight Details */}
          <FlightInfoCard
            flightType={flight.flightType}
            origin={{
              city: "Madrid, España",
              airport: "Adolfo Suárez Madrid-Barajas (MAD)",
            }}
            destination={{
              city: "Ibiza, España",
              airport: "Aeropuerto de Ibiza (IBZ)",
            }}
            fbo={{
              name: "Signature Flight Support",
              location: "Terminal Ejecutiva, Puerta 3",
            }}
            schedule={{
              time: "10:30 → 11:15",
              duration: "Duración: 45 min",
            }}
          />

          {/* Aircraft */}
          <AircraftInfoCard
            model={flight.aircraft.model}
            registration={flight.aircraft.registration}
            base="Madrid (MAD)"
            capacity={flight.aircraft.capacity}
            type="Jet ligero"
            status="active"
            onViewAircraft={handleViewAircraft}
          />

          {/* Crew */}
          <CrewInfoCard crew={flight.crew} onViewCrew={handleViewCrew} />
        </div>

        {/* Right Column */}
        <div style={{ width: "400px" }}>
          <AdminControlCard
            totalSeats={flight.totalSeats}
            soldSeats={flight.soldSeats}
            availableSeats={flight.availableSeats}
            pricePerSeat={flight.pricePerSeat}
            passengers={flight.passengers}
            onMarkInFlight={handleMarkInFlight}
            onEditFlight={handleEditFlight}
            onDownloadManifest={handleDownloadManifest}
          />
        </div>
      </div>
    </div>
  );
}
