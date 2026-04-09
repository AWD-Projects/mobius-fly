import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FlightDetail } from "@/types/app.types";
import type { PaymentBreakdown } from "@/lib/payments/fees";

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

export interface LastSearch {
    origin: string;
    destination: string;
    date?: string;
    returnDate?: string;
    type: string;
    passengers: number;
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
    reservationId: string | null;
    bookingReference: string | null;
    breakdown: PaymentBreakdown | null;
    lastSearch: LastSearch | null;
    /** True once the store has been rehydrated from localStorage. */
    _hasHydrated: boolean;

    setFlight: (id: string, detail: FlightDetail) => void;
    setLastSearch: (search: LastSearch) => void;
    setPurchaseType: (type: "seats" | "full_aircraft") => void;
    setTotalPassengers: (n: number) => void;
    setDistribution: (adults: number, minors: number) => void;
    setTotalPrice: (price: number) => void;
    initPassengers: (adults: number, minors: number) => void;
    updatePassenger: (index: number, data: Partial<StoredPassenger>) => void;
    setReservation: (id: string, bookingReference: string, blockedUntil: string, breakdown: PaymentBreakdown) => void;
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
    | "setReservation"
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
    reservationId: null,
    bookingReference: null,
    breakdown: null,
    lastSearch: null,
    _hasHydrated: false,
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            ...defaultState,

            _setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

            setFlight: (id, detail) => set({ flightId: id, flightDetail: detail }),

            setLastSearch: (search) => set({ lastSearch: search }),

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

            setReservation: (id, bookingReference, blockedUntil, breakdown) =>
                set({ reservationId: id, bookingReference, blockedUntil, breakdown }),

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
                reservationId: state.reservationId,
                bookingReference: state.bookingReference,
                breakdown: state.breakdown,
                passengers: state.passengers,
                lastSearch: state.lastSearch,
                // _hasHydrated is intentionally excluded — always starts false and is set at runtime
            }),
            onRehydrateStorage: () => (state) => {
                state?._setHasHydrated(true);
            },
        },
    ),
);
