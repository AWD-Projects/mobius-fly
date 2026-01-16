# Mobius Fly Design System

Premium aviation design system built with Next.js, Tailwind CSS, and Storybook.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the design system.

### Run Next.js Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Design System Structure

### Atoms
- Button (primary, secondary, ghost, link variants)
- Input, Textarea, Select
- Checkbox, Radio, Switch
- Badge
- Tooltip
- Icon

### Molecules
- InputGroup (label + input + error)
- ButtonGroup
- NumericCounter
- StatusBadge
- Stepper
- PriceBlock
- Pagination
- InfoListItem

## Design Tokens

All design tokens are defined in `styles/globals.css` and configured in `tailwind.config.ts`.

### Colors
- Primary: #C4A77D
- Secondary: #39424E
- Background: #F6F6F4
- Success, Warning, Error states

### Typography
- Serif headings (Playfair Display)
- Sans-serif body (Inter)

### Spacing
- Consistent 4px-based scale

### Shadows
- Soft, Hover, Modal variants
# mobius-fly
