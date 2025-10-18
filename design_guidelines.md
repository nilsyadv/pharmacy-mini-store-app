# Design Guidelines: Pharmacy Management System

## Design Approach: Design System (Medical/Professional)

**Selected System**: Material Design with healthcare industry adaptations
**Justification**: Utility-focused application requiring efficiency, data density, clear information hierarchy, and professional medical aesthetic. Standard UI patterns ensure familiarity and reduce training time for pharmacy staff.

**Core Principles**:
- Clinical clarity over visual flair
- Rapid data entry and retrieval
- Error prevention through clear UI states
- Professional, trustworthy appearance
- Mobile-optimized for inventory checks on the go

## Color Palette

**Light Mode** (Primary):
- Primary: 210 95% 42% (Medical blue - trustworthy, professional)
- Surface: 0 0% 98% (Clean white backgrounds)
- Surface variant: 210 20% 96% (Subtle card backgrounds)
- Border: 210 15% 88%
- Text primary: 210 20% 15%
- Text secondary: 210 10% 45%
- Success: 142 70% 45% (Stock available)
- Warning: 38 95% 50% (Low stock alerts)
- Error: 0 84% 60% (Out of stock, critical alerts)

**Dark Mode**:
- Primary: 210 90% 58%
- Surface: 210 15% 12%
- Surface variant: 210 12% 16%
- Border: 210 10% 24%
- Text primary: 210 10% 95%
- Text secondary: 210 8% 70%

## Typography

**Fonts**: 
- Primary: Inter (Google Fonts) - clean, highly legible for data-heavy interfaces
- Monospace: JetBrains Mono - for prescription codes, SKUs, batch numbers

**Hierarchy**:
- Page titles: text-2xl font-semibold (Inter)
- Section headers: text-lg font-medium
- Card titles: text-base font-medium
- Body text: text-sm font-normal
- Data labels: text-xs font-medium uppercase tracking-wide
- Numbers/codes: text-sm font-mono

## Layout System

**Spacing Primitives**: Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Tight spacing (p-2, gap-2) for dense data tables and inventory lists
- Standard spacing (p-4, gap-4) for forms and card interiors
- Comfortable spacing (p-6, gap-6) for primary action areas
- Section separation (p-8, py-12) for distinct functional zones

**Grid System**:
- Desktop: Two-column layout (sidebar navigation + main content area)
- Tablet: Collapsible sidebar with overlay
- Mobile: Single column with bottom navigation

## Component Library

**Navigation**:
- Desktop: Fixed left sidebar (w-64) with categorized menu items
- Mobile: Bottom tab bar with 4-5 primary functions (Dashboard, Inventory, Sales, Prescriptions, More)
- Top bar: Search, notifications, quick actions, user profile

**Data Display**:
- Tables: Striped rows, sortable columns, sticky headers, row hover states
- Inventory cards: Medicine name, stock level, expiry date, price, quick actions
- Status badges: Pill-shaped with color-coded backgrounds (in-stock, low-stock, expired, pending)
- Statistics cards: Large numbers with trend indicators and sparkline charts

**Forms**:
- Search bars: Prominent with autocomplete for medicine names
- Input fields: Clear labels above, helper text below, validation states
- Barcode scanner button: Positioned prominently for quick product lookup
- Date pickers: For expiry dates and prescription dates
- Quantity steppers: +/- buttons for stock adjustments

**Action Components**:
- Primary CTA: Filled buttons (bg-primary) for critical actions like "Add to Cart", "Process Sale"
- Secondary actions: Outlined buttons for "View Details", "Edit"
- Danger actions: Red outlined for "Delete", "Mark Expired"
- FAB (Mobile): Floating action button for "Quick Add Inventory" or "New Sale"

**Overlays**:
- Modals: For detailed medicine information, prescription entry, customer profiles
- Slide-out panels: For cart/checkout on desktop
- Bottom sheets (Mobile): For quick actions and filters
- Toast notifications: Success confirmations, error alerts, low stock warnings

**Dashboard Widgets**:
- Sales summary cards (daily/weekly/monthly revenue)
- Low stock alerts list
- Upcoming expiry warnings
- Top-selling medicines chart
- Recent transactions feed

## Mobile-First Considerations

- Large touch targets (min-h-12) for all interactive elements
- Swipe gestures for common actions (swipe-to-delete in lists)
- Bottom-anchored primary actions for thumb reach
- Collapsible sections to manage screen real estate
- Offline-first approach with sync indicators
- Quick access camera for barcode/QR scanning

## Animations

Minimal and purposeful only:
- Subtle fade-ins for new content loading
- Smooth transitions for sidebar collapse/expand
- Success checkmark animation for completed transactions
- No decorative animations - performance and clarity prioritized

## Accessibility

- High contrast ratios (WCAG AAA where possible)
- Clear focus indicators for keyboard navigation
- Screen reader labels for all icons and actions
- Color-blind friendly status indicators (icons + text, not color alone)
- Large, readable text sizes
- Clear error messages with corrective guidance