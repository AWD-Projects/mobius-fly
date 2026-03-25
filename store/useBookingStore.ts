import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    /** True once the store has been rehydrated from localStorage. */
    _hasHydrated: boolean;

    setFlight: (id: string, detail: FlightDetail) => void;
    setPurchaseType: (type: "seats" | "full_aircraft") => void;
    setTotalPassengers: (n: number) => void;
    setDistribution: (adults: number, minors: number) => void;
    setTotalPrice: (price: number) => void;
    initPassengers: (adults: number, minors: number) => void;
    updatePassenger: (index: number, data: Partial<StoredPassenger>) => void;
    reset: () => void;
    _setHasHydrated: (value: boolean) => void;
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
    | "_setHasHydrated"
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
    _hasHydrated: false,
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            ...defaultState,

            _setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

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
        }),
        {
            name: "mobius-booking",
            partialize: (state) => ({
                flightId: state.flightId,
                flightDetail: state.flightDetail,
                purchaseType: state.purchaseType,
                totalPassengers: state.totalPassengers,
                adults: state.adults,
                minors: state.minors,
                totalPrice: state.totalPrice,
                blockedUntil: state.blockedUntil,
                passengers: state.passengers,
                // _hasHydrated is intentionally excluded — always starts false and is set at runtime
            }),
            onRehydrateStorage: () => (state) => {
                state?._setHasHydrated(true);
            },
        },
    ),
);
