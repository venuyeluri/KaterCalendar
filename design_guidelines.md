# Catering Menu Calendar - Design Guidelines

## Design Approach: Reference-Based (Food Service + Scheduling Hybrid)

**Primary References**: Uber Eats (menu presentation), OpenTable (booking flow), Linear (dashboard clarity)

**Core Principle**: Create an appetizing, trust-building experience that makes menu browsing effortless while maintaining professional scheduling functionality.

---

## Color Palette

### Light Mode
- **Primary Brand**: 24 82% 50% (Vibrant Orange - food industry standard)
- **Primary Hover**: 24 82% 45%
- **Background**: 0 0% 100% (Pure white for cleanliness)
- **Surface**: 40 10% 97% (Warm off-white for cards)
- **Text Primary**: 24 20% 15% (Warm dark brown)
- **Text Secondary**: 24 10% 45%
- **Border**: 24 15% 88%
- **Success**: 142 71% 45% (Order confirmation)

### Dark Mode
- **Primary Brand**: 24 90% 55% (Brighter orange for contrast)
- **Primary Hover**: 24 90% 60%
- **Background**: 24 15% 8% (Warm dark)
- **Surface**: 24 12% 12% (Elevated cards)
- **Text Primary**: 40 10% 95%
- **Text Secondary**: 40 8% 70%
- **Border**: 24 15% 20%

---

## Typography

**Font Stack**: 
- Display/Headers: 'Inter', sans-serif (700, 600)
- Body: 'Inter', sans-serif (400, 500)
- Numbers/Prices: 'Inter', sans-serif (600, 700)

**Scale**:
- Hero/Landing: text-5xl md:text-6xl font-bold
- Page Titles: text-3xl md:text-4xl font-semibold
- Section Headers: text-2xl font-semibold
- Menu Item Names: text-lg font-semibold
- Body Text: text-base
- Captions/Labels: text-sm text-secondary

---

## Layout System

**Spacing Units**: Tailwind 4, 6, 8, 12, 16, 24 (strict adherence for consistency)

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Padding: px-4 md:px-6 lg:px-8
- Section Spacing: py-12 md:py-16 lg:py-24

**Grid Patterns**:
- Calendar: 7-column grid (days of week)
- Menu Items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard Cards: grid-cols-1 md:grid-cols-2 xl:grid-cols-3

---

## Component Library

### Navigation
- **Header**: Sticky top-0 with blur backdrop (backdrop-blur-md bg-background/80)
- Logo left, main nav center, user actions right
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16 consistent

### Calendar View
- **Design Pattern**: Month view with date cells showing menu indicators
- Available dates: Subtle orange dot indicator
- Selected date: Filled orange background with white text
- Hover states: Soft orange tint (bg-primary/5)
- Cell size: Square aspect ratio, min-h-20

### Menu Cards
- **Structure**: Image-first design (aspect-video or 3:2)
- Rounded corners: rounded-xl
- Shadow: shadow-sm hover:shadow-md transition
- Padding: p-6
- Item layout: Image → Name → Description → Price → Quantity selector
- Badge for dietary info: Absolute top-right, rounded-full px-3 py-1

### Order Form
- **Layout**: Two-column on desktop (menu items | order summary)
- Quantity Input: Number stepper with +/- buttons, rounded-lg border
- Add to Order: Primary button, full width on mobile
- Running Total: Sticky bottom bar on mobile, sidebar card on desktop

### Dashboard (Caterer View)
- **Stats Cards**: Grid layout with key metrics (Total Orders, Revenue, Items)
- Icon + Number + Label pattern
- Background: Subtle gradient from primary/5 to transparent
- Date Range Selector: Prominent, top-right positioning

### Forms
- **Input Style**: rounded-lg border-2 focus:border-primary transition
- Labels: font-medium mb-2 block
- Textarea: min-h-32 for descriptions
- File Upload: Dashed border drag-and-drop zone for menu images

### Buttons
- **Primary**: bg-primary text-white rounded-lg px-6 py-3 font-semibold
- **Secondary**: bg-surface border-2 border-border rounded-lg px-6 py-3
- **Ghost**: hover:bg-surface rounded-lg px-4 py-2
- **Icon Buttons**: p-2 rounded-lg hover:bg-surface

### Data Display
- **Tables**: Minimal borders, zebra striping (odd:bg-surface/50)
- **Order Lists**: Card-based on mobile, table on desktop
- **Status Badges**: rounded-full px-3 py-1 text-sm font-medium

---

## Images

### Hero Section (Landing/Marketing Pages)
- **Main Hero**: High-quality food photography showing diverse catered dishes, warm lighting
- Placement: Full-width, aspect-[21/9] on desktop, aspect-video on mobile
- Overlay: Subtle dark gradient (from-black/40 to-transparent) for text readability
- CTA buttons over image: Use backdrop-blur-sm bg-white/10 for outline variant buttons

### Menu Item Images
- **Requirement**: Each menu item should have appetizing food photography
- Aspect ratio: aspect-[4/3] for consistency
- Lazy loading: Essential for performance
- Fallback: Subtle gradient background with utensils icon if image missing

### Dashboard/Empty States
- **Illustration Style**: Simple line drawings or icons for empty calendar days
- Warm, inviting color scheme matching primary palette

---

## Interactions & States

**Animations**: Minimal, purposeful only
- Page transitions: Fade in (opacity 0→1, 300ms)
- Card hover: Transform scale-[1.02] + shadow
- Button press: scale-[0.98]
- Calendar date selection: Scale pulse effect

**Loading States**:
- Skeleton screens for menu items and calendar
- Spinner: Rotating orange circle for form submissions

**Accessibility**:
- Focus rings: ring-2 ring-primary ring-offset-2
- Dark mode toggle: Persistent across sessions
- All form inputs with proper labels and ARIA

---

## Page-Specific Layouts

### Landing Page (For Caterers)
- Hero with food imagery + value proposition
- 3-column feature grid (Easy Menu Publishing | Customer Management | Order Tracking)
- Visual calendar preview section
- CTA: "Start Publishing Menus" - prominent, primary button

### Customer Order Flow
1. Calendar selection (month view, highlight available dates)
2. Menu display (3-column grid of items with images)
3. Order review (sticky summary sidebar)
4. Confirmation (Success state with order number)

### Caterer Dashboard
- Top metrics row (4 cards)
- Calendar picker + Selected date's menu details
- Orders table below
- "Publish New Menu" floating action button (bottom-right, lg+ screens)

**Design Philosophy**: Food-first visuals, friction-free ordering, professional caterer tools.