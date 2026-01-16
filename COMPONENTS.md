# Mobius Fly - Component Library

## Atoms

### Button
**Path:** `components/atoms/Button.tsx`

Premium button component with multiple variants and states.

**Variants:**
- `primary` - Gold primary action
- `secondary` - Dark secondary action
- `ghost` - Transparent background
- `link` - Text link style

**Sizes:**
- `sm` - Small (h-9)
- `md` - Medium (h-11)
- `lg` - Large (h-14)

**Features:**
- Loading state with spinner
- Icon support
- Disabled state
- Focus ring

---

### Input
**Path:** `components/atoms/Input.tsx`

Clean text input with premium styling.

**Types:** text, email, password, number, date, time

**States:**
- Default
- Error
- Disabled
- Focus with ring

---

### Textarea
**Path:** `components/atoms/Textarea.tsx`

Multi-line text input.

**Features:**
- Resizable vertically
- Error state
- Disabled state

---

### Select
**Path:** `components/atoms/Select.tsx`

Dropdown select component.

---

### Checkbox
**Path:** `components/atoms/Checkbox.tsx`

Custom checkbox with checkmark icon.

---

### Radio
**Path:** `components/atoms/Radio.tsx`

Radio button with filled circle on selection.

---

### Switch
**Path:** `components/atoms/Switch.tsx`

Toggle switch component.

---

### Tooltip
**Path:** `components/atoms/Tooltip.tsx`

Hover tooltip component.

**Positions:** top, bottom, left, right

---

### Icon
**Path:** `components/atoms/Icon.tsx`

Lucide icon wrapper.

**Sizes:** sm (16px), md (20px), lg (24px)

---

## Molecules

### InputGroup
**Path:** `components/molecules/InputGroup.tsx`

Complete input with label, helper text, and error message.

**Features:**
- Label with required indicator
- Helper text
- Error message
- Accessibility attributes

---

### ButtonGroup
**Path:** `components/molecules/ButtonGroup.tsx`

Group of buttons with spacing.

**Orientations:** horizontal, vertical

---

### NumericCounter
**Path:** `components/molecules/NumericCounter.tsx`

Increment/decrement number input.

**Features:**
- Min/max limits
- Step control
- Disabled state

---

### StatusBadge
**Path:** `components/molecules/StatusBadge.tsx`

Badge with icon indicator.

**Statuses:** success, warning, error, info

---

### SectionHeader
**Path:** `components/molecules/SectionHeader.tsx`

Header with title and subtitle for page or section titles.

**Sizes:** section, page
**Align:** left, center

---

### SystemScreen
**Path:** `components/molecules/SystemScreen.tsx`

System screen layout for 404/500/maintenance/offline and similar pages.

---

### Stepper
**Path:** `components/molecules/Stepper.tsx`

Visual progress stepper.

**Features:**
- Completed/current/upcoming states
- Optional descriptions
- Connected progress line

---

### PriceBlock
**Path:** `components/molecules/PriceBlock.tsx`

Formatted price display.

**Features:**
- Currency label
- Period (hour, flight, etc)
- Optional description

---

### Pagination
**Path:** `components/molecules/Pagination.tsx`

Page navigation component.

**Features:**
- Previous/Next buttons
- Page numbers
- Ellipsis for many pages

---

### InfoListItem
**Path:** `components/molecules/InfoListItem.tsx`

Icon + label + value info display.

**Features:**
- Lucide icon support
- Optional icon color
- Clean layout

---

## Design Tokens

All tokens in `styles/globals.css`:

### Colors
- `--color-primary` #C4A77D (Gold)
- `--color-secondary` #39424E (Dark blue-gray)
- `--color-text` #2B2B2B
- `--color-background` #F6F6F4
- `--color-success` #4CAF50
- `--color-warning` #D8A32A
- `--color-error` #D25C5C

### Typography
- Serif: Playfair Display (headings)
- Sans: Inter (body)

### Spacing Scale
4px → 8px → 16px → 24px → 32px → 40px → 48px

### Border Radius
- sm: 6px
- md: 10px
- lg: 16px
- xl: 24px

### Shadows
- soft: subtle elevation
- hover: interactive hover
- modal: prominent overlay
