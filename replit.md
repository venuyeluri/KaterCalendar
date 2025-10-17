# CaterCalendar - Catering Menu Calendar Application

## Overview

CaterCalendar is a web application designed for catering businesses to publish daily menus, manage customer orders, and streamline operations. The platform provides two main user experiences: a customer-facing interface for browsing menus and placing orders, and a caterer dashboard for menu management and order tracking.

The application follows a food service and scheduling hybrid approach, drawing inspiration from Uber Eats for menu presentation, OpenTable for booking flows, and Linear for dashboard clarity.

## User Preferences

Preferred communication style: Simple, everyday language.

## Environment Management

The application includes environment identification banners on both the customer order page and caterer dashboard. These banners display:
- **Repl Name**: The name of the application instance (e.g., "CaterCalendar")
- **Repository**: The repository identifier (e.g., "venuyeluri/workspace")
- **Branch Name**: The current branch being used (e.g., "StagingCC")

**Implementation:**
- Shared `EnvironmentBanner` component in `client/src/components/EnvironmentBanner.tsx`
- Centralized configuration in `client/src/lib/env.ts`
- Uses Vite environment variables for easy deployment configuration
- Includes accessibility features (ARIA labels and status role)

**How to Update for Different Environments:**
When forking the Repl for different environments (DEV, Beta, UAT, PROD), set the following environment variables in your Repl's Secrets:

- `VITE_REPL_NAME` - e.g., "CaterCalendar-PROD", "CaterCalendar-Beta", "CaterCalendar-UAT"
- `VITE_BRANCH_NAME` - e.g., "main", "staging", "beta", "uat"
- `VITE_REPO_NAME` - e.g., "venuyeluri/catercalendar-prod"

Alternatively, you can update the defaults in `client/src/lib/env.ts`:

```typescript
export const ENV_CONFIG = {
  replName: import.meta.env.VITE_REPL_NAME || "CaterCalendar-DEV",
  branchName: import.meta.env.VITE_BRANCH_NAME || "main",
  repoName: import.meta.env.VITE_REPO_NAME || "venuyeluri/workspace",
} as const;
```

This provides instant visual confirmation of which environment you're working in, preventing accidental changes to production.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite

**Design System:**
- Custom color palette optimized for food service (vibrant orange primary, warm neutrals)
- Light and dark mode support via ThemeProvider context
- Component library based on Shadcn/ui "new-york" style
- Responsive design with mobile-first approach

**Key Frontend Features:**
- Calendar view for browsing available menu dates
- Menu item cards with dietary information and quantity selection
- Order summary with real-time total calculation
- Dashboard with statistics and order management
- Theme toggle for light/dark mode
- Environment banner displaying Repl name, repository, and branch information (for multi-environment support)

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Development**: Vite middleware for HMR and SSR in development

**API Design:**
- RESTful API endpoints under `/api` namespace
- JSON request/response format
- Validation using Zod schemas
- Centralized error handling middleware

**Data Layer:**
- Storage abstraction layer (`IStorage` interface) for database operations
- `DbStorage` implementation using Drizzle ORM
- Separation of concerns between routes, storage, and database connection

**Server Architecture:**
- Express middleware for request logging and JSON parsing
- Vite integration for development with hot module replacement
- Static file serving in production
- Request duration tracking and logging

### Data Models

**Menu Items:**
- Core entity representing individual dishes
- Fields: id, name, description, price, image, dietary restrictions (array)
- Used as building blocks for daily menus

**Menus:**
- Represents a published menu for a specific date
- Fields: id, date, itemIds (array), maxOrders
- Links to menu items via item IDs

**Orders:**
- Customer orders associated with a specific menu
- Fields: id, menuId, customerName, items (JSON string), total, date, status
- Status workflow: pending → confirmed → completed

### External Dependencies

**Database:**
- Neon PostgreSQL serverless database
- Connection via `@neondatabase/serverless` package
- Configuration through `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database queries and schema management

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- Includes: dialogs, dropdowns, popovers, tooltips, calendars, forms, and more
- Customized via Tailwind CSS and component variants

**Fonts:**
- Google Fonts integration
- Primary fonts: Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter
- Loaded via HTML link tags in index.html

**Form Management:**
- React Hook Form for form state management
- Zod for schema validation via `@hookform/resolvers`
- Integration with Drizzle-Zod for database schema validation

**Date Handling:**
- date-fns library for date formatting and manipulation
- React Day Picker for calendar UI component

**Asset Management:**
- Static images stored in `attached_assets/generated_images`
- Vite alias configuration for asset imports
- Pre-generated food imagery for menu items

**Development Tools:**
- Replit-specific plugins for dev banner and cartographer (development only)
- Runtime error overlay for improved debugging
- ESBuild for production server bundling