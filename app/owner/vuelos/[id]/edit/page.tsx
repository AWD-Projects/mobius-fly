"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InputGroup } from "@/components/molecules/InputGroup";
import { SelectGroup } from "@/components/molecules/SelectGroup";
import { NumericCounter } from "@/components/molecules/NumericCounter";
import { DocumentUpload } from "@/components/molecules/DocumentUpload";

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
        <Button
          onClick={handleBack}
          variant="link"
          className="flex items-center gap-3 mb-5 p-0 text-xs font-medium text-muted hover:text-text"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al vuelo
        </Button>

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
            <div className="flex-1">
              <SelectGroup
                label="Origen"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              >
                <option value="">Seleccionar aeropuerto</option>
                <option value="MAD">Madrid (MAD)</option>
                <option value="BCN">Barcelona (BCN)</option>
                <option value="SVQ">Sevilla (SVQ)</option>
              </SelectGroup>
            </div>
            <div className="flex-1">
              <SelectGroup
                label="Destino"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              >
                <option value="">Seleccionar aeropuerto</option>
                <option value="IBZ">Ibiza (IBZ)</option>
                <option value="PMI">Palma de Mallorca (PMI)</option>
                <option value="AGP">Málaga (AGP)</option>
              </SelectGroup>
            </div>
          </div>

          <div className="w-full h-px bg-[#F0F0F0]" />

          <div className="flex gap-8">
            <div className="flex-1">
              <InputGroup
                label="FBO de origen"
                type="text"
                value={formData.fboOrigin}
                onChange={(e) => setFormData({ ...formData, fboOrigin: e.target.value })}
                placeholder="ingresa dirección del FBO"
              />
            </div>
            <div className="flex-1">
              <InputGroup
                label="FBO de destino (opcional)"
                type="text"
                value={formData.fboDestination}
                onChange={(e) => setFormData({ ...formData, fboDestination: e.target.value })}
                placeholder="ingresa dirección del FBO"
              />
            </div>
          </div>

          <div className="w-full h-px bg-[#F0F0F0]" />

          <div className="flex gap-8">
            <div className="flex-1">
              <InputGroup
                label="Hora de salida"
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <InputGroup
                label="Fecha del vuelo"
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>
          </div>

          {/* Regreso Section (only for redondo) */}
          {flightType === "redondo" && (
            <>
              <div className="w-full h-px bg-border" />

              <h3 className="text-xs font-medium text-text">Vuelo de regreso</h3>

              <div className="flex gap-8">
                <div className="flex-1">
                  <SelectGroup
                    label="Origen"
                    value={formData.returnOrigin}
                    onChange={(e) => setFormData({ ...formData, returnOrigin: e.target.value })}
                  >
                    <option value="">Seleccionar aeropuerto</option>
                    <option value="IBZ">Ibiza (IBZ)</option>
                    <option value="PMI">Palma de Mallorca (PMI)</option>
                    <option value="AGP">Málaga (AGP)</option>
                  </SelectGroup>
                </div>
                <div className="flex-1">
                  <SelectGroup
                    label="Destino"
                    value={formData.returnDestination}
                    onChange={(e) => setFormData({ ...formData, returnDestination: e.target.value })}
                  >
                    <option value="">Seleccionar aeropuerto</option>
                    <option value="MAD">Madrid (MAD)</option>
                    <option value="BCN">Barcelona (BCN)</option>
                    <option value="SVQ">Sevilla (SVQ)</option>
                  </SelectGroup>
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F0F0]" />

              <div className="flex gap-8">
                <div className="flex-1">
                  <InputGroup
                    label="FBO de origen"
                    type="text"
                    value={formData.returnFboOrigin}
                    onChange={(e) => setFormData({ ...formData, returnFboOrigin: e.target.value })}
                    placeholder="ingresa dirección del FBO"
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="FBO de destino (opcional)"
                    type="text"
                    value={formData.returnFboDestination}
                    onChange={(e) => setFormData({ ...formData, returnFboDestination: e.target.value })}
                    placeholder="ingresa dirección del FBO"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F0F0]" />

              <div className="flex gap-8">
                <div className="flex-1">
                  <InputGroup
                    label="Hora de salida"
                    type="time"
                    value={formData.returnDepartureTime}
                    onChange={(e) => setFormData({ ...formData, returnDepartureTime: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="Fecha de salida"
                    type="date"
                    value={formData.returnDepartureDate}
                    onChange={(e) => setFormData({ ...formData, returnDepartureDate: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Aircraft Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold text-text">Aeronave asignada</h2>
          <SelectGroup
            label=""
            value={formData.aircraft}
            onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
          >
            <option value="">Seleccionar aeronave</option>
            <option value="1">Citation CJ3+ (EC-MBX)</option>
            <option value="2">Phenom 300 (EC-NBR)</option>
            <option value="3">Legacy 500 (EC-LJK)</option>
          </SelectGroup>
        </div>

        {/* Crew Section */}
        <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-text">Tripulación asignada</h2>
          </div>

          <SelectGroup
            label="Capitán / Piloto"
            value={formData.captain}
            onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
          >
            <option value="">Seleccionar capitán</option>
            <option value="1">Carlos Pérez (ATPL, IR, ME)</option>
            <option value="2">Laura Martínez (ATPL, IR, ME)</option>
          </SelectGroup>

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
                    <SelectGroup
                      label=""
                      value={crew}
                      onChange={(e) => handleCrewChange(index, e.target.value)}
                      className="flex-1"
                    >
                      <option value="">Seleccionar tripulante</option>
                      <option value="1">María García (CPL, IR)</option>
                      <option value="2">Juan López (CPL)</option>
                      <option value="3">Ana Martínez (Asistente)</option>
                    </SelectGroup>
                    <Button
                      onClick={() => handleRemoveCrew(index)}
                      variant="outline"
                      className="w-9 h-9 p-0"
                      aria-label="Eliminar tripulante"
                    >
                      <Trash2 className="w-4 h-4 text-muted" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleAddCrew}
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar tripulante
            </Button>
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
                <div className="flex-1">
                  <NumericCounter
                    label="Asientos para venta"
                    value={formData.seatsForSale}
                    onChange={(value) => setFormData({ ...formData, seatsForSale: value })}
                    min={1}
                    max={12}
                  />
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
            <DocumentUpload
              accept=".pdf"
              onUpload={(file: File) => setFormData({ ...formData, flightPlan: file })}
              pendingTitle="Plan de vuelo"
              pendingDescription="Máximo 10 MB"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            onClick={handleUpdate}
            variant="primary"
            className="w-60 h-10"
          >
            Actualizar vuelo
          </Button>
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="w-60 h-10"
          >
            Guardar borrador
          </Button>
        </div>
      </div>
    </div>
  );
}
