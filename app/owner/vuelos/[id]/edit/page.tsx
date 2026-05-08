"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus, File, Trash2 } from "lucide-react";

type FlightType = "sencillo" | "redondo";

interface FlightFormData {
  flightType: FlightType;
  origin: string;
  destination: string;
  fboOrigin: string;
  fboDestination: string;
  departureTime: string;
  departureDate: string;
  returnOrigin: string;
  returnDestination: string;
  returnFboOrigin: string;
  returnFboDestination: string;
  returnDepartureTime: string;
  returnDepartureDate: string;
  aircraft: string;
  captain: string;
  additionalCrew: string[];
  seatsForSale: number;
  pricePerSeat: string;
  flightPlan: File | null;
}

// Mock data - en producción esto vendría de una API
const mockFlightData: Record<string, FlightFormData> = {
  "1": {
    flightType: "sencillo" as FlightType,
    origin: "MAD",
    destination: "IBZ",
    fboOrigin: "ExecJet Madrid",
    fboDestination: "Signature Ibiza",
    departureTime: "10:30",
    departureDate: "2025-02-14",
    returnOrigin: "",
    returnDestination: "",
    returnFboOrigin: "",
    returnFboDestination: "",
    returnDepartureTime: "",
    returnDepartureDate: "",
    aircraft: "1",
    captain: "1",
    additionalCrew: [],
    seatsForSale: 4,
    pricePerSeat: "500.00",
    flightPlan: null,
  },
};

export default function EditFlightPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.id as string;

  // Load existing flight data or use defaults
  const existingFlight = mockFlightData[flightId] || {
    flightType: "sencillo" as FlightType,
    origin: "",
    destination: "",
    fboOrigin: "",
    fboDestination: "",
    departureTime: "",
    departureDate: "",
    returnOrigin: "",
    returnDestination: "",
    returnFboOrigin: "",
    returnFboDestination: "",
    returnDepartureTime: "",
    returnDepartureDate: "",
    aircraft: "",
    captain: "",
    additionalCrew: [] as string[],
    seatsForSale: 4,
    pricePerSeat: "",
    flightPlan: null as File | null,
  };

  const [flightType, setFlightType] = useState<FlightType>(existingFlight.flightType);
  const [formData, setFormData] = useState(existingFlight);

  const handleAddCrew = () => {
    setFormData((prev) => ({
      ...prev,
      additionalCrew: [...prev.additionalCrew, ""],
    }));
  };

  const handleRemoveCrew = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalCrew: prev.additionalCrew.filter((_, i) => i !== index),
    }));
  };

  const handleCrewChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalCrew: prev.additionalCrew.map((crew, i) => (i === index ? value : crew)),
    }));
  };

  const handleBack = () => {
    router.push(`/owner/vuelos/${flightId}`);
  };

  const handleSeatsChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      seatsForSale: Math.max(1, Math.min(12, prev.seatsForSale + delta)),
    }));
  };

  const calculateFullAircraftPrice = () => {
    const pricePerSeat = parseFloat(formData.pricePerSeat) || 0;
    const totalSeats = 8; // Assuming 8 total seats
    return (pricePerSeat * totalSeats).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });
  };

  const handleUpdate = () => {
    console.log("Updating flight:", flightId, formData);
    // Aquí iría la lógica para actualizar el vuelo
    router.push(`/owner/vuelos/${flightId}`);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // Aquí iría la lógica para guardar el borrador
  };

  return (
    <div className="w-full bg-[#f6f6f4] min-h-screen">
      {/* Header Section */}
      <div className="px-12 py-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-3 mb-5 text-xs font-medium text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al vuelo
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] font-semibold text-text">Editar vuelo</h1>
          <p className="text-sm text-muted">
            Modifica la configuración de tu vuelo
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-8 flex flex-col gap-7">
        {/* Flight Type Selector */}
        <div className="flex">
          <button
            onClick={() => setFlightType("sencillo")}
            className={`flex-1 h-11 rounded-l-xl border border-border transition-colors ${
              flightType === "sencillo"
                ? "bg-white text-text font-medium"
                : "bg-[#f6f6f4] text-muted"
            }`}
          >
            Sencillo
          </button>
          <button
            onClick={() => setFlightType("redondo")}
            className={`flex-1 h-11 rounded-r-xl border border-border border-l-0 transition-colors ${
              flightType === "redondo"
                ? "bg-white text-text font-medium"
                : "bg-[#f6f6f4] text-muted"
            }`}
          >
            Redondo
          </button>
        </div>

        {/* Flight Info Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
          <h2 className="text-[11px] font-semibold text-text">
            {flightType === "sencillo" ? "Vuelo de ida" : "Vuelos de ida y regreso"}
          </h2>

          {/* Ida Section */}
          {flightType === "redondo" && (
            <h3 className="text-xs font-medium text-text">Vuelo de ida</h3>
          )}

          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">Origen</label>
              <select
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
              >
                <option value="">Seleccionar aeropuerto</option>
                <option value="MAD">Madrid (MAD)</option>
                <option value="BCN">Barcelona (BCN)</option>
                <option value="SVQ">Sevilla (SVQ)</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">Destino</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
              >
                <option value="">Seleccionar aeropuerto</option>
                <option value="IBZ">Ibiza (IBZ)</option>
                <option value="PMI">Palma de Mallorca (PMI)</option>
                <option value="AGP">Málaga (AGP)</option>
              </select>
            </div>
          </div>

          <div className="w-full h-px bg-[#F0F0F0]" />

          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">FBO de origen</label>
              <input
                type="text"
                value={formData.fboOrigin}
                onChange={(e) => setFormData({ ...formData, fboOrigin: e.target.value })}
                placeholder="ingresa dirección del FBO"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm placeholder:text-[#CCCCCC]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">FBO de destino (opcional)</label>
              <input
                type="text"
                value={formData.fboDestination}
                onChange={(e) => setFormData({ ...formData, fboDestination: e.target.value })}
                placeholder="ingresa dirección del FBO"
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm placeholder:text-[#CCCCCC]"
              />
            </div>
          </div>

          <div className="w-full h-px bg-[#F0F0F0]" />

          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">Hora de salida</label>
              <input
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-medium text-text">Fecha del vuelo</label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
              />
            </div>
          </div>

          {/* Regreso Section (only for redondo) */}
          {flightType === "redondo" && (
            <>
              <div className="w-full h-px bg-border" />

              <h3 className="text-xs font-medium text-text">Vuelo de regreso</h3>

              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Origen</label>
                  <select
                    value={formData.returnOrigin}
                    onChange={(e) => setFormData({ ...formData, returnOrigin: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
                  >
                    <option value="">Seleccionar aeropuerto</option>
                    <option value="IBZ">Ibiza (IBZ)</option>
                    <option value="PMI">Palma de Mallorca (PMI)</option>
                    <option value="AGP">Málaga (AGP)</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Destino</label>
                  <select
                    value={formData.returnDestination}
                    onChange={(e) => setFormData({ ...formData, returnDestination: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
                  >
                    <option value="">Seleccionar aeropuerto</option>
                    <option value="MAD">Madrid (MAD)</option>
                    <option value="BCN">Barcelona (BCN)</option>
                    <option value="SVQ">Sevilla (SVQ)</option>
                  </select>
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F0F0]" />

              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">FBO de origen</label>
                  <input
                    type="text"
                    value={formData.returnFboOrigin}
                    onChange={(e) => setFormData({ ...formData, returnFboOrigin: e.target.value })}
                    placeholder="ingresa dirección del FBO"
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm placeholder:text-[#CCCCCC]"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">FBO de destino (opcional)</label>
                  <input
                    type="text"
                    value={formData.returnFboDestination}
                    onChange={(e) => setFormData({ ...formData, returnFboDestination: e.target.value })}
                    placeholder="ingresa dirección del FBO"
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm placeholder:text-[#CCCCCC]"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F0F0]" />

              <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Hora de salida</label>
                  <input
                    type="time"
                    value={formData.returnDepartureTime}
                    onChange={(e) => setFormData({ ...formData, returnDepartureTime: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Fecha de salida</label>
                  <input
                    type="date"
                    value={formData.returnDepartureDate}
                    onChange={(e) => setFormData({ ...formData, returnDepartureDate: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Aircraft Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
          <select
            value={formData.aircraft}
            onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
            className="h-11 px-3 rounded-lg border border-border bg-transparent text-sm"
          >
            <option value="">Seleccionar aeronave</option>
            <option value="1">Citation CJ3+ (EC-MBX)</option>
            <option value="2">Phenom 300 (EC-NBR)</option>
            <option value="3">Legacy 500 (EC-LJK)</option>
          </select>
        </div>

        {/* Crew Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-text">Tripulación asignada</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text">Capitán / Piloto</label>
            <select
              value={formData.captain}
              onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
              className="h-11 px-3 rounded-lg border border-border bg-transparent text-sm"
            >
              <option value="">Seleccionar capitán</option>
              <option value="1">Carlos Pérez (ATPL, IR, ME)</option>
              <option value="2">Laura Martínez (ATPL, IR, ME)</option>
            </select>
          </div>

          <div className="w-full h-px bg-[#F0F0F0]" />

          <div>
            <h3 className="text-xs font-medium text-text mb-1">Tripulación adicional (opcional)</h3>
            <p className="text-[11px] text-muted mb-3">
              Puedes agregar copiloto, mecánico, asistente o cualquier otro miembro de tripulación
            </p>

            {/* Additional Crew List */}
            {formData.additionalCrew.length > 0 && (
              <div className="flex flex-col gap-3 mb-3">
                {formData.additionalCrew.map((crew, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] border border-border"
                  >
                    <select
                      value={crew}
                      onChange={(e) => handleCrewChange(index, e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-border bg-transparent text-sm"
                    >
                      <option value="">Seleccionar tripulante</option>
                      <option value="1">María García (CPL, IR)</option>
                      <option value="2">Juan López (CPL)</option>
                      <option value="3">Ana Martínez (Asistente)</option>
                    </select>
                    <button
                      onClick={() => handleRemoveCrew(index)}
                      className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-neutral/5 transition-colors"
                      aria-label="Eliminar tripulante"
                    >
                      <Trash2 className="w-4 h-4 text-muted" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAddCrew}
              className="w-full h-10 rounded-lg border border-border flex items-center justify-center gap-2 text-sm font-medium text-[#666666] hover:bg-neutral/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar tripulante
            </button>
          </div>
        </div>

        {/* Commercial & Flight Plan Row */}
        <div className="flex gap-7">
          {/* Commercial Section */}
          <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
            <h2 className="text-[11px] font-semibold text-text">Configuración comercial</h2>

            <div>
              <h3 className="text-xs font-medium text-text mb-3">Opciones de venta</h3>

              <div className="flex gap-3 mb-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text">Asientos para venta</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSeatsChange(-1)}
                      className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-neutral/5 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-muted" />
                    </button>
                    <span className="text-sm font-medium text-text min-w-[2ch] text-center">
                      {formData.seatsForSale}
                    </span>
                    <button
                      onClick={() => handleSeatsChange(1)}
                      className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-neutral/5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-muted" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-text">Precio por asiento</label>
                  <div className="flex items-center h-10 px-3 rounded-lg border border-border">
                    <span className="text-sm text-muted">$</span>
                    <input
                      type="number"
                      value={formData.pricePerSeat}
                      onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-sm outline-none ml-2"
                    />
                    <span className="text-sm text-muted">MXN</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text">Precio por avión completo</label>
                <div className="h-10 px-3 rounded-lg border border-border flex items-center gap-2 bg-[#FAFAFA]">
                  <span className="text-sm text-muted">$</span>
                  <span className="text-sm text-text">{calculateFullAircraftPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Plan Section */}
          <div className="flex-1 bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
            <h2 className="text-[11px] font-semibold text-text">Plan de vuelo</h2>
            <p className="text-[11px] text-muted">
              Carga el PDF con el plan de vuelo detallado
            </p>

            <div className="border-2 border-dashed border-border rounded-xl bg-[#F9F9F7] p-8 flex flex-col items-center justify-center gap-4 h-[132px]">
              <File className="w-8 h-8 text-muted" />
              <div className="text-center">
                <p className="text-sm font-medium text-text">
                  Arrastra un PDF aquí o haz clic para cargar
                </p>
                <p className="text-[11px] text-muted mt-1">Máximo 10 MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={handleUpdate}
            className="w-60 h-10 rounded-xl bg-text text-white text-sm font-medium hover:bg-text/90 transition-colors"
          >
            Actualizar vuelo
          </button>
          <button
            onClick={handleSaveDraft}
            className="w-60 h-10 rounded-xl bg-white border border-border text-sm font-medium text-text hover:bg-neutral/5 transition-colors"
          >
            Guardar borrador
          </button>
        </div>
      </div>
    </div>
  );
}
