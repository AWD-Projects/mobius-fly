import { create } from "zustand";
import type { FlightDetail } from "@/types/app.types";

export interface StoredPassenger {
    slotType: "adult" | "minor";
    fullName?: string;
    sex?: string;
    dateOfBirth?: string;
    email?: string;
    phone?: string;
    responsibleName?: string;
    responsibleRelationship?: string;
    responsiblePhone?: string;
    documentUrl?: string;
    isCompleted: boolean;
}

interface BookingState {
    flightId: string | null;
    flightDetail: FlightDetail | null;
    purchaseType: "seats" | "full_aircraft" | null;
    totalPassengers: number;
    adults: number;
    minors: number;
    totalPrice: number;
    passengers: StoredPassenger[];
    blockedUntil: string | null;

    setFlight: (id: string, detail: FlightDetail) => void;
    setPurchaseType: (type: "seats" | "full_aircraft") => void;
    setTotalPassengers: (n: number) => void;
    setDistribution: (adults: number, minors: number) => void;
    setTotalPrice: (price: number) => void;
    initPassengers: (adults: number, minors: number) => void;
    updatePassenger: (index: number, data: Partial<StoredPassenger>) => void;
    reset: () => void;
}

const defaultState: Omit<
    BookingState,
    | "setFlight"
    | "setPurchaseType"
    | "setTotalPassengers"
    | "setDistribution"
    | "setTotalPrice"
    | "initPassengers"
    | "updatePassenger"
    | "reset"
> = {
    flightId: null,
    flightDetail: null,
    purchaseType: null,
    totalPassengers: 1,
    adults: 0,
    minors: 0,
    totalPrice: 0,
    passengers: [],
    blockedUntil: null,
};

export const useBookingStore = create<BookingState>((set) => ({
    ...defaultState,

    setFlight: (id, detail) => set({ flightId: id, flightDetail: detail }),

    setPurchaseType: (type) => set({ purchaseType: type }),

    setTotalPassengers: (n) => set({ totalPassengers: n }),

    setDistribution: (adults, minors) => set({ adults, minors }),

    setTotalPrice: (price) => set({ totalPrice: price }),

    initPassengers: (adults, minors) => {
        const passengers: StoredPassenger[] = [
            ...Array.from({ length: adults }, () => ({
                slotType: "adult" as const,
                isCompleted: false,
            })),
            ...Array.from({ length: minors }, () => ({
                slotType: "minor" as const,
                isCompleted: false,
            })),
        ];
        set({ adults, minors, passengers });
    },

    updatePassenger: (index, data) =>
        set((state) => {
            const passengers = [...state.passengers];
            passengers[index] = { ...passengers[index], ...data };
            return { passengers };
        }),

    reset: () => set(defaultState),
}));
