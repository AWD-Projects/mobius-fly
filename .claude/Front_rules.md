# FRONT_RULES.md — Mobius Fly Frontend

> Archivo de referencia central para el equipo de frontend.
> Cubre reglas técnicas, contexto del producto, estructuras de datos y patrones de implementación.
> Leer completo antes de maquetar cualquier pantalla.

---

## ÍNDICE

1. [Contexto del Producto](#1-contexto-del-producto)
2. [Roles de Usuario y Acceso](#2-roles-de-usuario-y-acceso)
3. [Flujos Críticos Resumidos](#3-flujos-críticos-resumidos)
4. [Estados de UI por Entidad](#4-estados-de-ui-por-entidad)
5. [Reglas de Negocio que Afectan la UI](#5-reglas-de-negocio-que-afectan-la-ui)
6. [Estructuras de Datos — Buyer](#6-estructuras-de-datos--buyer)
7. [Zustand — Store del Flujo de Compra](#7-zustand--store-del-flujo-de-compra)
8. [Sistema de Diseño](#8-sistema-de-diseño)
9. [Stack y Reglas Técnicas](#9-stack-y-reglas-técnicas)
10. [Estructura de Archivos](#10-estructura-de-archivos)
11. [Acceso a Diseño — MCP Pencil Dev](#11-acceso-a-diseño--mcp-pencil-dev)
12. [Componentes — Política de Reutilización](#12-componentes--política-de-reutilización)
13. [Formularios — React Hook Form + Zod](#13-formularios--react-hook-form--zod)
14. [Validación — React Doctor](#14-validación--react-doctor)
15. [Preguntas Obligatorias Antes de Implementar](#15-preguntas-obligatorias-antes-de-implementar)

---

## 1. CONTEXTO DEL PRODUCTO

**Mobius Fly** es un marketplace de aviación privada mexicana. Los propietarios de jets privados publican vuelos con asientos disponibles ("empty legs") y los compradores los reservan con o sin cuenta.

- **No es una aerolínea.** Es un marketplace. Mobius no opera los vuelos, los valida.
- Los vuelos son publicados por propietarios privados y deben ser aprobados manualmente por el equipo de Mobius antes de ser visibles al público.
- El pago se procesa con **Stripe Checkout externo** (redirección). No hay formulario de tarjeta embebido.
- Los documentos de identidad son **obligatorios** por cada pasajero. Sin documento, no hay reserva.
- El sistema de asientos es **numérico**, no hay mapa visual de asientos.
- La plataforma opera en **MXN** por defecto.

---

## 2. ROLES DE USUARIO Y ACCESO

### 2.1. Invitado (sin cuenta)

**Puede:**
- Ver la landing page completa
- Buscar y filtrar vuelos
- Ver el detalle de un vuelo
- Iniciar y completar el flujo de reserva (booking como guest)
- Registrarse como comprador o propietario

**No puede:**
- Ver "Mis viajes"
- Ver su perfil
- Tener historial de reservas

**Rutas accesibles:** `/`, `/vuelos`, `/vuelos/[id]`, `/reserva/[flightId]`, `/reserva/estado`, `/login/*`, `/registro/*`, `/verificacion`, `/terminos`, `/privacidad`

---

### 2.2. Comprador / Passenger (con cuenta)

**Puede:**
- Todo lo que puede el invitado
- Ver "Mis viajes" (próximos y pasados)
- Ver el detalle de cada reserva propia
- Descargar su boleto/confirmación en PDF (solo reservas activas/confirmadas)
- Gestionar su perfil: datos personales, documento de identidad, contacto, contraseña

**No puede:**
- Acceder a ninguna ruta `/owner/*`
- Ver vuelos de otros compradores
- Cancelar directamente (debe escribir a contacto@mobiusfly.com)

**Rutas accesibles:** Todo lo de invitado + `/mis-viajes`, `/mis-viajes/[id]`, `/perfil`

**Redirección automática:**
- Si intenta acceder a ruta de owner → `/acceso-denegado`
- Si sesión expirada → `/sesion-expirada`

---

### 2.3. Propietario / Owner (con cuenta)

> **Fuera del scope actual del frontend buyer.** Documentado solo para contexto de routing y separación de accesos.

Accede a `/owner/*` y `/onboarding`. Tiene dashboard propio, gestión de flota, vuelos y manifiestos.

---

### 2.4. Admin

Panel separado, proyecto independiente. Completamente fuera de scope aquí.

---

## 3. FLUJOS CRÍTICOS RESUMIDOS

### 3.1. Flujo de Reserva (Booking) — El más importante

Este es el flujo central del producto. Tiene estado global (ver sección 7).

```
/vuelos → /vuelos/[id] → /reserva/[flightId]
  └─ Step 1: Selección de asientos
  └─ Step 2: Datos de pasajeros + documentos
  └─ Step 3: Resumen + disclaimer
  └─ [Redirección a Stripe Checkout externo]
  └─ /reserva/estado
       ├─ Pago exitoso → mostrar confirmación
       ├─ Pago fallido → mostrar error + opción de reintentar
       └─ Reserva expirada → mostrar pantalla de expiración
```

**Puntos críticos de UX:**
- Al iniciar Step 1, el sistema bloquea los asientos por **15 minutos**. Mostrar contador regresivo siempre visible.
- Si el contador llega a 0 antes del pago → redirigir a `/reserva-expirada`.
- Si el usuario está logueado → pre-llenar datos del titular de la reserva en Step 2.
- El pago **nunca** ocurre dentro de la app. Es una redirección a Stripe.

---

### 3.2. Flujo de Autenticación — Comprador

```
/registro/comprador
  └─ Formulario: nombre, fecha de nac., sexo, email, contraseña, doc. identidad PDF, T&C
  └─ Sistema envía OTP al correo
  └─ /verificacion → ingresa OTP
  └─ Cuenta activa → redirigir a /mis-viajes (o a la reserva en curso si venía de una)

/login/comprador
  └─ Email + contraseña
  └─ Auth Supabase JWT
  └─ Redirigir según estado de sesión
```

**Importante:** Si el usuario inició una reserva como invitado y luego hace login, el estado del booking en Zustand debe mantenerse.

---

### 3.3. Flujo "Mis Viajes" — Buyer

```
/mis-viajes
  └─ Tab "Próximos" → lista de reservas con status CONFIRMED y departure_datetime en el futuro
  └─ Tab "Pasados" → reservas con departure_datetime en el pasado o status COMPLETED
  └─ Click en reserva → /mis-viajes/[id]
       └─ Detalle completo
       └─ Botón "Descargar boleto" (solo si status = CONFIRMED)
```

---

## 4. ESTADOS DE UI POR ENTIDAD

### 4.1. Estados de Vuelo (`flight_status`)

| Código | Label UI | Color | Visible al público |
|--------|----------|-------|--------------------|
| `PENDING_REVIEW` | En revisión | warning | ❌ No |
| `APPROVED` | Disponible | success | ✅ Sí |
| `ON_TIME` | A tiempo | success | ✅ Sí |
| `DELAYED` | Demorado | warning | ✅ Sí |
| `IN_FLIGHT` | En vuelo | primary | ✅ Sí (no reservable) |
| `CANCELLED` | Cancelado | error | ✅ Sí (informativo) |
| `COMPLETED` | Finalizado | neutral | ✅ Sí (informativo) |

**Regla de botón "Reservar":** Solo habilitado si `status = APPROVED | ON_TIME` Y `available_seats > 0` Y `departure_datetime > ahora + 3h`.

---

### 4.2. Estados de Reserva (`reservation_status`)

| Código | Label UI | Color | Descripción |
|--------|----------|-------|-------------|
| `BLOCKED` | Pendiente de pago | warning | Asientos bloqueados, en proceso de pago (15 min) |
| `EXPIRED` | Expirada | neutral | No se pagó a tiempo |
| `CONFIRMED` | Confirmada | success | Pago exitoso |
| `CANCELLED` | Cancelada | error | Cancelada por pasajero o propietario |

---

### 4.3. Estados de Documento (`document_status`)

| Código | Label UI | Color | Descripción |
|--------|----------|-------|-------------|
| `PENDING` | En revisión | warning | Cargado, esperando validación manual |
| `APPROVED` | Aprobado | success | Validado por Mobius |
| `REJECTED` | Rechazado | error | Rechazado, mostrar `rejected_reason` |

Aplica a: documentos de usuario (`user_documents`), aeronave (`aircraft_documents`), tripulación (`crew_documents`).

---

### 4.4. Estados de Aeronave (contexto owner, para referencia)

`PENDING_REVIEW` → `APPROVED` → puede usarse en vuelos.
Si no está `APPROVED`, no aparece en el selector al crear vuelo.

---

## 5. REGLAS DE NEGOCIO QUE AFECTAN LA UI

Estas reglas deben estar implementadas en el frontend. No son solo validaciones de backend.

### 5.1. Vuelo no reservable — 3 horas
Si `departure_datetime - now() < 3 horas`:
- Botón "Reservar" deshabilitado con tooltip: _"Este vuelo ya no acepta reservas."_
- No redirigir a `/reserva/[flightId]`, mostrar mensaje en la misma página.

### 5.2. Bloqueo de asientos — 15 minutos
- El contador inicia cuando el usuario confirma el número de asientos (Step 1 del booking).
- Mostrar countdown prominente en **todos** los steps del flujo de reserva.
- Si expira: redirigir a `/reserva-expirada` y limpiar el store de Zustand.

### 5.3. Menores de edad
- En el formulario de pasajeros, si `date_of_birth` resulta en edad < 18 años:
  - Mostrar modal/alerta bloqueante: _"El registro de pasajeros menores de edad requiere validaciones adicionales. Para continuar con esta reserva, por favor contáctanos directamente en contacto@mobiusfly.com. El menor deberá viajar acompañado de un adulto responsable dentro de la misma reservación."_
  - El campo `is_minor` debe marcarse `true`.
  - Debe existir al menos un adulto en la misma reserva (`guardian_passenger_id` se asigna).

### 5.4. Documentos obligatorios
- El campo de documento PDF es **requerido** por cada pasajero. No se puede avanzar sin él.
- Solo formato PDF. Validar con Zod: `z.instanceof(File).refine(f => f.type === 'application/pdf')`.
- Mexicanos (`nationality = 'MX'`): INE o Pasaporte. Extranjeros: solo Pasaporte.
- Mostrar el selector de tipo de documento condicionado a la nacionalidad del pasajero.

### 5.5. Disclaimer de reembolso — obligatorio en resumen
En el Step 3 (Resumen), mostrar siempre este texto visible antes del botón de pagar:
> _"Tienes 24 horas desde el momento de la reserva para solicitar un reembolso completo escribiendo a contacto@mobiusfly.com. Pasado ese tiempo, no hay derecho a devolución."_

### 5.6. Fórmula de precios — mostrar desglose
En el resumen de compra, nunca mostrar solo el total. Siempre desglosar:

```
Precio por asiento:          $X,XXX MXN
× N asientos:                $XX,XXX MXN
Cargo por servicio (5%):     $X,XXX MXN
Subtotal:                    $XX,XXX MXN
IVA (16%):                   $X,XXX MXN
──────────────────────────────────────
Total a pagar:               $XX,XXX MXN
```

El owner recibe: precio - 5%. Esto **no** se muestra al comprador, es solo contexto interno.

### 5.7. Selección de asientos — numérica, no visual
No hay mapa de asientos. Solo un selector numérico: "¿Cuántos asientos necesitas? [1] [2] [3]..."
Máximo: `available_seats` del vuelo.

### 5.8. Reserva de aeronave completa
El usuario puede seleccionar "Avión completo" si quiere todos los asientos. En ese caso:
- `seats_requested = total_seats`
- Se usa `price_full_aircraft` en lugar de `price_per_seat * seats`
- Igualmente se requieren documentos de **todos** los pasajeros.

---

## 6. ESTRUCTURAS DE DATOS — BUYER

> Estas interfaces viven en `src/types/app.types.ts`.
> El equipo de frontend puede maquetar con estas estructuras sin necesidad de integración activa con Supabase.
> Los datos reales los proveerá el Server Component padre via props.

### 6.1. Perfil del Usuario Comprador

```typescript
// src/types/app.types.ts

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string       // ISO 8601: "1990-05-15"
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  phone: string | null
  country_code: string | null // "+52"
  nationality: string         // ISO 3166-1 alpha-2: "MX", "US", etc.
  role: 'PASSENGER' | 'OWNER'
  email_verified_at: string | null
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  email: string               // viene de auth.users, se adjunta en el hook
}

export interface UserDocument {
  id: string
  user_id: string
  document_type: 'INE' | 'PASSPORT'
  document_url: string
  document_status: DocumentStatusCode
  rejected_reason: string | null
}

export type DocumentStatusCode = 'PENDING' | 'APPROVED' | 'REJECTED'
```

---

### 6.2. Vuelo (listado y búsqueda)

```typescript
export interface Airport {
  id: string
  iata_code: string           // "MEX", "GDL", "MTY"
  name: string
  city: string
  state: string
  country: string
}

export interface FlightListItem {
  id: string
  flight_code: string         // "MF-2024-001"
  flight_type: 'ONE_WAY' | 'ROUND_TRIP'
  departure_airport: Airport
  arrival_airport: Airport
  departure_fbo_name: string
  arrival_fbo_name: string | null
  departure_datetime: string  // ISO 8601
  arrival_datetime: string    // ISO 8601
  total_seats: number
  available_seats: number
  price_per_seat: number      // en MXN
  price_full_aircraft: number // en MXN
  currency: 'MXN'
  flight_status: FlightStatusCode
  // Campos calculados útiles para la UI (pueden venir del servidor)
  is_reservable: boolean      // available_seats > 0 && departure en +3h && status reservable
  duration_minutes: number | null
}

export type FlightStatusCode =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'ON_TIME'
  | 'DELAYED'
  | 'IN_FLIGHT'
  | 'CANCELLED'
  | 'COMPLETED'
```

---

### 6.3. Detalle de Vuelo (página `/vuelos/[id]`)

```typescript
export interface CrewMemberPublic {
  id: string
  first_name: string
  last_name: string
  crew_role: 'CAPTAIN' | 'FIRST_OFFICER' | 'CREW'
}

export interface AircraftPublic {
  id: string
  manufacturer: string
  model: string
  year: number
  seats: number
  photos: string[]            // URLs públicas
}

export interface FlightDetail extends FlightListItem {
  aircraft: AircraftPublic
  crew: CrewMemberPublic[]
  flight_plan_url: string | null
}
```

---

### 6.4. Pasajero en el Formulario de Reserva

```typescript
export interface PassengerFormData {
  full_name: string
  date_of_birth: string       // "YYYY-MM-DD"
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  email: string
  phone: string | null
  nationality: string         // para determinar qué documento pedir
  document_type: 'INE' | 'PASSPORT'
  document_file: File         // PDF — solo en cliente, no se serializa en Zustand
  document_url?: string       // URL después de upload — sí se guarda en Zustand
  is_minor: boolean
  guardian_index: number | null // índice del adulto en el array de pasajeros
}
```

---

### 6.5. Datos de Contacto de la Reserva (titular)

```typescript
export interface ReservationContact {
  contact_full_name: string
  contact_email: string
  contact_phone: string
}
```

---

### 6.6. Resumen de Compra (Step 3 del flujo)

```typescript
export interface BookingSummary {
  flight: FlightDetail
  seats_requested: number
  is_full_aircraft: boolean
  passengers: PassengerFormData[]
  contact: ReservationContact
  pricing: BookingPricing
}

export interface BookingPricing {
  base_price_per_seat: number
  base_price_total: number      // price_per_seat * seats (o price_full_aircraft)
  passenger_fee_rate: number    // 0.05
  passenger_fee_amount: number  // base_price_total * 0.05
  subtotal: number              // base_price_total + passenger_fee_amount
  vat_rate: number              // 0.16
  vat_amount: number            // subtotal * 0.16
  amount_total: number          // subtotal + vat_amount
  currency: 'MXN'
}
```

---

### 6.7. Reserva en "Mis Viajes" (historial)

```typescript
export type ReservationStatusCode = 'BLOCKED' | 'EXPIRED' | 'CONFIRMED' | 'CANCELLED'

export interface ReservationListItem {
  id: string
  booking_reference: string     // "MOB-XXXXXX"
  flight: FlightListItem
  seats_requested: number
  reservation_status: ReservationStatusCode
  confirmed_at: string | null
  blocked_until: string | null
  amount_total_paid: number | null
  currency: 'MXN'
}
```

---

### 6.8. Detalle de Reserva (`/mis-viajes/[id]`)

```typescript
export interface ReservationPassenger {
  id: string
  full_name: string
  date_of_birth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  email: string
  phone: string | null
  document_type: 'INE' | 'PASSPORT'
  document_url: string
  is_minor: boolean
}

export interface ReservationDetail extends ReservationListItem {
  flight: FlightDetail
  passengers: ReservationPassenger[]
  contact_full_name: string
  contact_email: string
  contact_phone: string
  payment: ReservationPayment | null
}

export interface ReservationPayment {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  base_price: number
  passenger_fee_amount: number
  vat_amount_total: number
  amount_total_paid: number
  paid_at: string | null
  currency: 'MXN'
}
```

---

## 7. ZUSTAND — STORE DEL FLUJO DE COMPRA

El flujo de reserva es multi-step y necesita estado persistente entre rutas.
El store vive en `src/store/useBookingStore.ts`.

> **Importante:** Los objetos `File` (documentos PDF) **no se serializan** en Zustand.
> Se guardan temporalmente en estado local del componente y solo la URL resultante (post-upload) va al store.

```typescript
// src/store/useBookingStore.ts

import { create } from 'zustand'
import type {
  FlightDetail,
  PassengerFormData,
  ReservationContact,
  BookingPricing,
} from '@/types/app.types'

export type BookingStep = 'seats' | 'passengers' | 'summary' | 'payment' | 'result'

export type BookingResult = 'success' | 'failed' | 'expired' | null

interface BookingState {
  // Vuelo seleccionado
  flight: FlightDetail | null

  // Step actual del flujo
  currentStep: BookingStep

  // Selección de asientos
  seats_requested: number
  is_full_aircraft: boolean

  // Timestamps del bloqueo
  blocked_until: string | null        // ISO 8601 — para el countdown

  // Pasajeros (sin File — solo URLs de documentos ya subidos)
  passengers: Omit<PassengerFormData, 'document_file'>[]

  // Contacto titular de la reserva
  contact: ReservationContact | null

  // Precios calculados
  pricing: BookingPricing | null

  // Referencia de reserva (generada al crear el BLOCKED en Supabase)
  booking_reference: string | null
  reservation_id: string | null

  // Resultado final del pago
  result: BookingResult

  // Acciones
  setFlight: (flight: FlightDetail) => void
  setSeats: (seats: number, isFullAircraft: boolean) => void
  setBlockedUntil: (until: string) => void
  setPassengers: (passengers: Omit<PassengerFormData, 'document_file'>[]) => void
  setContact: (contact: ReservationContact) => void
  setPricing: (pricing: BookingPricing) => void
  setBookingReference: (ref: string, reservationId: string) => void
  setStep: (step: BookingStep) => void
  setResult: (result: BookingResult) => void
  reset: () => void
}

const initialState = {
  flight: null,
  currentStep: 'seats' as BookingStep,
  seats_requested: 1,
  is_full_aircraft: false,
  blocked_until: null,
  passengers: [],
  contact: null,
  pricing: null,
  booking_reference: null,
  reservation_id: null,
  result: null,
}

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setFlight: (flight) => set({ flight }),
  setSeats: (seats_requested, is_full_aircraft) =>
    set({ seats_requested, is_full_aircraft }),
  setBlockedUntil: (blocked_until) => set({ blocked_until }),
  setPassengers: (passengers) => set({ passengers }),
  setContact: (contact) => set({ contact }),
  setPricing: (pricing) => set({ pricing }),
  setBookingReference: (booking_reference, reservation_id) =>
    set({ booking_reference, reservation_id }),
  setStep: (currentStep) => set({ currentStep }),
  setResult: (result) => set({ result }),
  reset: () => set(initialState),
}))
```

**Cuándo llamar `reset()`:**
- Pago exitoso confirmado
- Reserva expirada (countdown a 0)
- Usuario navega fuera del flujo de reserva manualmente

**Cuándo NO llamar `reset()`:**
- Login/registro durante el flujo (el estado debe sobrevivir)
- Navegación entre steps del mismo flujo

---

## 8. SISTEMA DE DISEÑO

### 8.1. Tipografía — SF PRO (INAMOVIBLE)

> ⚠️ La fuente del proyecto es **SF Pro**. Está configurada en el theme de Tailwind.
> **NUNCA** cambiarla, ni agregar `font-family` inline, ni importar otra fuente.
> Si detectas que estás a punto de cambiar la fuente: **no lo hagas**.

- Titulares (H1–H4): serif — Playfair Display o Libre Baskerville
- Cuerpo y UI: SF Pro (sans-serif, via Tailwind)

### 8.2. Colores — Solo tokens del theme

```
--color-primary:     #C4A77D   → botones primarios, acentos, badges
--color-secondary:   #39424E   → botones secundarios, navbar owner
--color-text:        #2B2B2B   → texto principal
--color-neutral:     #C7C7C5   → bordes, líneas, inputs inactivos
--color-background:  #F6F6F4   → fondo global
--color-success:     #4CAF50   → confirmado
--color-warning:     #D8A32A   → pendiente
--color-error:       #D25C5C   → error, rechazado
--color-disabled:    rgba(0,0,0,0.15)
```

**Nunca usar valores hexadecimales arbitrarios.** Si el color que necesitas no está en el theme, preguntar antes de añadirlo.

### 8.3. Espaciado

Escala de 4px estricta. Usar clases del theme: `space-xxs` (4px) → `space-2xl` (48px).

### 8.4. Border Radius

`radius-sm` (6px) inputs · `radius-md` (10px) cards pequeñas · `radius-lg` (16px) cards/modales · `radius-xl` (24px) botones premium.

### 8.5. Sombras

```css
--shadow-soft:  0px 4px 12px rgba(0,0,0,0.06)   /* cards en reposo */
--shadow-hover: 0px 6px 18px rgba(0,0,0,0.12)   /* hover */
--shadow-modal: 0px 12px 32px rgba(0,0,0,0.20)  /* modales */
```

### 8.6. Botones

| Variante | Fondo | Texto | Radio |
|----------|-------|-------|-------|
| Primario | `color-primary` | `color-text` | `radius-xl` |
| Secundario | `color-secondary` | blanco | `radius-xl` |
| Ghost | transparente + borde `color-secondary` | `color-secondary` | `radius-xl` |
| Link | — | `color-secondary` | — |

Tamaños: Grande (h-12 px-6 text-base) · Mediano (h-10 px-5 text-base) · Chico (h-8 px-4 text-sm).

### 8.7. Inputs

Altura: 44px · Padding: 16px · Radio: `radius-sm` · Font: 16px.

| Estado | Borde |
|--------|-------|
| Normal | `1px solid color-neutral` |
| Focus | `1px solid color-primary` + ring `rgba(196,167,125,0.25)` |
| Error | `1px solid color-error` |
| Disabled | fondo `rgba(0,0,0,0.03)` |

### 8.8. Navbar

Altura: 72px · Padding lateral: 32px · Divisor inferior: `1px solid color-neutral` · Logo a la izquierda.

---

## 9. STACK Y REGLAS TÉCNICAS

### 9.1. Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14+ (App Router) |
| Lenguaje | TypeScript — tipado estricto, sin `any` |
| Estilos | TailwindCSS (solo clases del theme) |
| BD / Auth | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Pagos | Stripe Checkout (externo) |
| Formularios | React Hook Form |
| Validaciones | Zod |
| Estado global | Zustand |
| Fetch / mutaciones | Server Components (equipo backend) + hooks de cliente cuando aplique |

### 9.2. Tipado

- **Cero `any`**. Si no sabes el tipo, pregunta.
- Usar `src/types/app.types.ts` para tipos de dominio.
- Usar `src/lib/supabase/types/database.types.ts` para tipos raw de Supabase.
- Props de componentes: siempre definir `interface NombreComponenteProps`.
- Inferir tipos de Zod con `z.infer<typeof schema>` — nunca duplicar tipos.

### 9.3. Server vs Client Components

- Server Component por defecto.
- Agregar `'use client'` solo si el componente necesita: hooks de React, eventos del usuario, Zustand, o APIs de browser.
- Los datos llegan como props desde el Server Component padre. El front **no hace fetch directo a Supabase** (eso es responsabilidad del equipo de backend/servidor).

### 9.4. Constantes — siempre desde `db.constants.ts`

```typescript
import {
  SEAT_BLOCK_DURATION,       // 15 * 60 * 1000 ms
  MIN_HOURS_TO_RESERVE,      // 3
  MIN_HOURS_TO_PUBLISH,      // 24
  PASSENGER_FEE,             // 0.05
  OWNER_FEE,                 // 0.05
  MOBIUS_COMMISSION,         // 0.10
  VAT,                       // 0.16
  CONTACT_EMAIL,             // "contacto@mobiusfly.com"
  BOOKING_REFERENCE_FORMAT,  // "MOB-XXXXXX"
} from '@/constants/db.constants'
```

Nunca hardcodear `0.05`, `0.16`, `15`, `3` u otros valores mágicos.

---

## 10. ESTRUCTURA DE ARCHIVOS

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    ← Landing
│   │   ├── vuelos/
│   │   │   ├── page.tsx                ← Búsqueda
│   │   │   └── [id]/page.tsx           ← Detalle de vuelo
│   │   └── reserva/
│   │       ├── [flightId]/page.tsx     ← Flujo booking (multi-step)
│   │       └── estado/page.tsx         ← Resultado del pago
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── comprador/page.tsx
│   │   │   └── propietario/page.tsx
│   │   ├── registro/
│   │   │   ├── comprador/page.tsx
│   │   │   └── propietario/page.tsx
│   │   └── verificacion/page.tsx
│   ├── (buyer)/
│   │   ├── mis-viajes/
│   │   │   ├── page.tsx                ← Lista de reservas
│   │   │   └── [id]/page.tsx           ← Detalle de reserva
│   │   └── perfil/page.tsx
│   └── (owner)/                        ← Fuera de scope buyer
│
├── components/
│   ├── ui/                             ← Componentes base (botones, inputs, badges...)
│   ├── flights/                        ← FlightCard, FlightFilters, FlightDetail...
│   ├── booking/                        ← SeatSelector, PassengerForm, BookingSummary...
│   ├── reservations/                   ← ReservationCard, ReservationDetail...
│   └── layout/                         ← Navbar, Footer, Sidebar...
│
├── lib/
│   ├── supabase/
│   │   ├── types/database.types.ts
│   │   ├── services/
│   │   ├── hooks/
│   │   └── client.ts / server.ts / admin.ts
│   └── zod/schemas.ts
│
├── store/
│   └── useBookingStore.ts              ← (y otros stores cuando aplique)
│
├── types/
│   └── app.types.ts
│
└── constants/
    └── db.constants.ts
```

### Convenciones
- Componentes específicos de una ruta (no reutilizables): en `_components/` dentro de la carpeta de la ruta.
- Un componente por archivo. Nombre del archivo = nombre del componente en PascalCase.
- Analizar siempre los archivos existentes del mismo grupo de rutas antes de crear uno nuevo.

---

## 11. ACCESO A DISEÑO — MCP PENCIL DEV

- **Siempre** consultar Pencil Dev antes de escribir cualquier pantalla o componente.
- Extraer: layout, espaciado exacto, variantes de estado, comportamiento en mobile.
- Si el frame no existe en Pencil Dev:
  > _"No encontré el frame '[nombre]' en Pencil Dev. ¿Puedes compartir el link, el JSON del diseño, o una captura?"_
- Nunca inventar un layout. Si no hay diseño: preguntar.

---

## 12. COMPONENTES — POLÍTICA DE REUTILIZACIÓN

El proyecto usa **componentes propios 100% custom** (sin shadcn/ui ni librerías externas de componentes).

### Flujo obligatorio

1. Buscar en `src/components/` si existe el componente.
2. Si existe → usarlo. Extender con nuevas props si hace falta.
3. Si no existe → preguntar:
   > _"No encontré '[NombreComponente]' en src/components/. ¿Está en otra ruta, o lo creo desde cero?"_
4. Crear solo si el usuario confirma.

### Al crear un componente nuevo

- Colocar en la subcarpeta correcta de `src/components/`.
- Definir `interface Props` completa y exportarla.
- Seguir el sistema de diseño al pie de la letra.
- Documentar props con JSDoc si el componente es reutilizable en múltiples pantallas.
- No crear componentes de una sola línea sin lógica — eso va inline.

---

## 13. FORMULARIOS — REACT HOOK FORM + ZOD

Todos los formularios usan React Hook Form + Zod. Sin excepciones.

```typescript
// Patrón estándar
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { passengerSchema } from '@/lib/zod/schemas' // si es reutilizable

type FormData = z.infer<typeof passengerSchema>

const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
  useForm<FormData>({ resolver: zodResolver(passengerSchema) })
```

- Schemas reutilizables (booking, registro, perfil) → `src/lib/zod/schemas.ts`.
- Schemas de una sola pantalla → inicio del archivo.
- Siempre mostrar errores inline debajo del campo.
- Siempre deshabilitar el submit mientras `isSubmitting = true`.
- Nunca usar `useState` para manejar valores de formulario — eso es trabajo de RHF.

---

## 14. VALIDACIÓN — REACT DOCTOR

Después de escribir cualquier componente o página:

1. Ejecutar `npx react-doctor` sobre los archivos modificados.
2. **Resolver todos los errores críticos** antes de entregar.
3. **Resolver warnings importantes** (hooks mal usados, deps faltantes, accesibilidad).
4. Warnings menores que no se puedan resolver sin cambiar lógica → reportar al usuario.

---

## 15. PREGUNTAS OBLIGATORIAS ANTES DE IMPLEMENTAR

Si cualquiera de estas situaciones aplica, **preguntar antes de escribir código**:

| Situación | Pregunta exacta |
|-----------|----------------|
| Type o interface no existe | "No encontré el type para `[entidad]`. ¿Está en otro archivo o lo creo en `app.types.ts`?" |
| Componente no encontrado | "No encontré `[NombreComponente]` en `src/components/`. ¿Está en otra ruta o lo creo desde cero?" |
| Diseño no disponible en Pencil Dev | "No encontré el frame `[nombre]` en Pencil Dev. ¿Puedes compartir el link, JSON o captura?" |
| Estructura de props desconocida | "¿Qué datos llegan como props a `[página]` desde el Server Component? ¿Puedes pasarme el type o estructura?" |
| Schema Zod no existe | "¿Existe un schema Zod para `[flujo]` o lo creo en `schemas.ts`?" |
| Store Zustand no existe | "¿Existe un store para `[feature]` o lo creo en `src/store/`?" |
| Regla de negocio ambigua | "¿Cómo debe comportarse la UI cuando `[caso edge]`?" |
| Color o token no está en el theme | "El color `[valor]` no está en el theme. ¿Lo agrego como nuevo token o hay un equivalente?" |
| Componente requiere datos de Supabase | "Esta pantalla necesita datos de `[tabla/query]`. ¿El Server Component ya los provee o están pendientes de integración?" |