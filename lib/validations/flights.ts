import { z } from "zod";

const iataCode = z
    .string()
    .trim()
    .toUpperCase()
    .length(3, "Código de aeropuerto debe tener 3 letras");

const isoDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)");

export const searchFlightsSchema = z
    .object({
        origin: iataCode,
        destination: iataCode,
        date: isoDate,
        returnDate: isoDate.optional(),
        type: z.enum(["one_way", "round_trip"]),
        passengers: z.number().int().min(1, "Mínimo 1 pasajero").max(20, "Máximo 20 pasajeros"),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(20).default(4),
        sortBy: z.enum(["price_asc", "price_desc"]).default("price_asc"),
    })
    .refine((d) => d.origin !== d.destination, {
        message: "Origen y destino no pueden ser iguales",
        path: ["destination"],
    })
    .refine((d) => d.type === "round_trip" ? !!d.returnDate : true, {
        message: "Fecha de regreso requerida para viaje redondo",
        path: ["returnDate"],
    });

export type SearchFlightsInput = z.infer<typeof searchFlightsSchema>;
