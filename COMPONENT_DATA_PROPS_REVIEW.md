# Component Data Props Review & Enhancement Plan

## Overview
This document outlines the necessary enhancements to all components to support data-driven props for API/endpoint integration.

## ✅ Completed
### KpiCard
- ✅ Added `data` prop for API integration
- ✅ Added `backgroundColor` prop for custom colors
- ✅ Added `iconBackgroundColor` and `badgeBackgroundColor` props
- ✅ Added `isLoading` state
- ✅ All props now optional to support data object

---

## 🔧 Components Requiring Updates

### ATOMS (Form Inputs & Controls)

#### Input
**Current State:** Basic input component
**Required Changes:**
- Add `data` prop: `{ value, error, helperText }`
- Add `isLoading` prop
- Add `onChange` callback with value
- Add validation states

#### Select
**Current State:** Basic select component
**Required Changes:**
- Add `options` prop: `{ label, value }[]` for API data
- Add `data` prop for pre-selected value
- Add `isLoading` prop for async options
- Add `onSelect` callback

#### Checkbox & Radio
**Current State:** Basic checkbox/radio
**Required Changes:**
- Add `data` prop for checked state from API
- Add group support: `items[]` prop
- Add `onChange` with value callback

#### DatePicker & TimePicker
**Current State:** Basic pickers
**Required Changes:**
- Add `data` prop for ISO date/time from API
- Add `format` prop for date formatting
- Add `onChange` with formatted value

---

### MOLECULES (Composite Components)

#### FilterBar
**Current State:** Filter controls
**Required Changes:**
- ✅ CRITICAL: Add `filters` data prop: `{ id, label, value, type, options }[]`
- Add `onFilterChange` callback
- Add `initialFilters` from API
- Add `isLoading` state
- Add `onReset` callback

#### Table
**Current State:** Table component
**Required Changes:**
- ✅ CRITICAL: Add `data` prop: `{ columns, rows }` from API
- Add `isLoading` prop with skeleton
- Add `pagination` data: `{ page, pageSize, total }`
- Add `onSort`, `onPageChange` callbacks
- Add `onRowClick` callback

#### Pagination
**Current State:** Pagination controls
**Required Changes:**
- ✅ CRITICAL: Add `data` prop: `{ currentPage, totalPages, totalItems, pageSize }`
- Add `onPageChange` callback with page number
- Add disabled state

#### PassengerForm
**Current State:** Form for passenger data
**Required Changes:**
- ✅ CRITICAL: Add `data` prop for pre-filled form
- Add `onSubmit` with form data
- Add `errors` prop from API validation
- Add `isSubmitting` state

---

### ORGANISMS (Card Components)

#### Flight Cards

##### UpcomingFlightCard
**Required Changes:**
- ✅ Add `data` prop: `{ route, date, time, duration, status, imageUrl }`
- Add `isLoading` prop
- Make all props optional

##### PastFlightCard
**Required Changes:**
- ✅ Add `data` prop: `{ route, date, timeRange, status, imageUrl }`
- Add `isLoading` prop
- Make all props optional

##### MinimalFlightCard
**Required Changes:**
- ✅ Add `data` prop with all flight details
- Add `isLoading` prop

##### FlightInfoCard
**Required Changes:**
- ✅ Add `data` prop with all flight info
- Add `isLoading` prop

##### FlightSummaryCard
**Required Changes:**
- ✅ Add `data` prop: `{ origin, destination, date, timeRange, flightType, passengers, price }`
- Add `isLoading` prop

---

#### Aircraft Cards

##### AircraftInfoCard
**Required Changes:**
- ✅ Add `data` prop: `{ model, registration, base, capacity, type, status }`
- Add `isLoading` prop

##### AircraftDataCard
**Required Changes:**
- ✅ Already has `data` prop ✓
- Add `isLoading` prop

##### AircraftCardWithImage
**Required Changes:**
- ✅ Add `data` prop with aircraft details
- Add `isLoading` prop

##### AircraftGalleryCard
**Required Changes:**
- ✅ Add `data` prop: `{ images, additionalCount }`
- Add `isLoading` prop with skeleton

##### AircraftSummaryCard
**Required Changes:**
- ✅ Already has `items` array ✓
- Add `data` prop alternative
- Add `isLoading` prop

##### AircraftDocumentationCard
**Required Changes:**
- ✅ Already has `documents` array ✓
- Add `data` prop alternative
- Add `isLoading` prop

##### AircraftActionsCard
**Required Changes:**
- ✅ Good as-is (actions are UI-driven)
- Add `isProcessing` prop for action states

---

#### Crew Cards

##### CrewDataCard
**Required Changes:**
- ✅ Already has `data` array ✓
- Add `isLoading` prop

##### CrewFlightsAssignedCard
**Required Changes:**
- ✅ Already has `flights` array ✓
- Add `data` prop alternative: `{ flights }`
- Add `isLoading` prop

##### CrewSummaryCard
**Required Changes:**
- ✅ Already has `items` array ✓
- Add `data` prop alternative
- Add `isLoading` prop

##### CrewListCard
**Required Changes:**
- ✅ Add `data` prop: `{ name, role, base, license, status, avatar }`
- Add `isLoading` prop

##### MinimalCrewCard
**Required Changes:**
- ✅ Already has `crew` array ✓
- Add `data` prop alternative
- Add `isLoading` prop

---

#### Admin & Management Cards

##### AdminControlCard
**Required Changes:**
- ✅ Already has structured props (summary, passengers)
- Add `data` prop: `{ summary, passengers, actions }`
- Add `isLoading` prop

##### AttentionSectionCard
**Required Changes:**
- ✅ Already has `items` array ✓
- Add `data` prop alternative
- Add `isLoading` prop

##### FleetNameCard
**Required Changes:**
- ✅ Has form state management ✓
- Add `isLoading` prop
- Add `isSaving` prop

##### PersonalDataCard
**Required Changes:**
- ✅ Already has `data` array ✓
- Add `isLoading` prop

---

#### Passenger & Booking Cards

##### PassengerNavigationCard
**Required Changes:**
- ✅ Already has structured data (adults, minors)
- Add `data` prop: `{ adults, minors }`
- Add `isLoading` prop

##### PricePassengerSelectorCard
**Required Changes:**
- ✅ Has interactive state ✓
- Add `data` prop: `{ pricePerSeat, currency, maxPassengers }`
- Add `isLoading` prop

##### AirportFBOCard
**Required Changes:**
- ✅ Already has structured props (departure, arrival)
- Add `data` prop: `{ departure, arrival }`
- Add `isLoading` prop

##### DocumentationInfoCard
**Required Changes:**
- ✅ Simple text component ✓
- Add `isLoading` prop

---

## 📋 Priority Implementation Order

### HIGH PRIORITY (Data-Heavy Components)
1. **FilterBar** - Critical for search/filter functionality
2. **Table** - Essential for data display
3. **Pagination** - Required for large datasets
4. **PassengerForm** - Form data handling
5. **All Card Components** - Add `isLoading` states

### MEDIUM PRIORITY (Form Controls)
6. **Select** - Options from API
7. **Input** - Validation from API
8. **Checkbox/Radio** - Group data from API

### LOW PRIORITY (Already Functional)
9. Components that already have good data structures

---

## 🎯 Standard Data Prop Pattern

All components should follow this pattern:

```typescript
export interface ComponentData {
  // All component-specific fields
}

export interface ComponentProps {
  // Individual props (optional when data is provided)
  prop1?: string;
  prop2?: number;

  // Data object from API (alternative to individual props)
  data?: ComponentData;

  // Common props for all components
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;

  // Event handlers
  onClick?: () => void;
  onChange?: (value: any) => void;
}
```

---

## 📝 Next Steps

1. Update all HIGH PRIORITY components first
2. Add TypeScript interfaces for data structures
3. Update Storybook stories with API data examples
4. Add loading skeleton states
5. Add error states
6. Document API response formats expected

---

## Example Usage After Updates

```typescript
// Option 1: Individual props
<KpiCard
  icon={Plane}
  value="7"
  title="Vuelos activos"
  backgroundColor="#39424e"
/>

// Option 2: Data prop (from API)
<KpiCard
  icon={Plane}
  data={apiResponse.kpiData}
  backgroundColor="#39424e"
  isLoading={isLoadingData}
/>

// Option 3: Loading state
<KpiCard
  icon={Plane}
  isLoading={true}
/>
```
